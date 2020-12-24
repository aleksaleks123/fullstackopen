import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const FeedbackButton = ({ text, onClickHandle }) =>
  <button onClick={onClickHandle}>
    {text}
  </button>


const Statistic = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad, all, average, positive }) => {

  if (all === 0) {
    return <p>No feedback given</p>
  }

  return <table>
    <tbody>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={all} />
      <Statistic text="average" value={average} />
      <Statistic text="positive" value={positive} /></tbody>
  </table>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = (good * 1.0 + bad * -1.0) / total
  const positive = good / total * 100

  return (
    <div>
      <h1>give feedback</h1>
      <FeedbackButton text="good" onClickHandle={() => setGood(good + 1)}></FeedbackButton>
      <FeedbackButton text="neutral" onClickHandle={() => setNeutral(neutral + 1)}></FeedbackButton>
      <FeedbackButton text="bad" onClickHandle={() => setBad(bad + 1)}></FeedbackButton>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={total} average={average} positive={positive}></Statistics>
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)
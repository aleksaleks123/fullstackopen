import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'


const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const Anecdotes = (props) => {
    const handleClick = (anecdote) => () => {
        props.voteAnecdote(anecdote)
        props.setNotification(`you voted '${anecdote.content}'`, 5)
    }
    return (
        <div>
            <h2>Anecdotes</h2>
            <Filter />
            {props.anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={handleClick(anecdote)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        anecdotes: state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter)).sort((a, b) => b.votes - a.votes),
        filter: state.fitler
    }
}

const mapDispatchToProps = {
    setNotification,
    voteAnecdote
}

const ConnectedAnecdotes = connect(
    mapStateToProps,
    mapDispatchToProps
)(Anecdotes)

export default ConnectedAnecdotes 
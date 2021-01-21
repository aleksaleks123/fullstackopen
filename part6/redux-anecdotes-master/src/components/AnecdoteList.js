import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange, notificationRemove } from '../reducers/notificationReducer'
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

const Anecdotes = () => {
    const dispatch = useDispatch()
    const filter = useSelector(({ filter }) => filter)
    const anecdotes = useSelector(({ anecdotes }) => anecdotes.filter(anecdote => anecdote.content.includes(filter))
        .sort((a, b) => b.votes - a.votes))
    const handleClick = (id, content) => () => {
        dispatch(voteAnecdote(id))
        dispatch(notificationChange(content))
        setTimeout(() => dispatch(notificationRemove()), 5000)
    }
    return (
        <div>
            <h2>Anecdotes</h2>
            <Filter />
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={handleClick(anecdote.id, anecdote.content)}
                />
            )}
        </div>
    )
}

export default Anecdotes
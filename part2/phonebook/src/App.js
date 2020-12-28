import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.error) {
    return (
      <div className="error">
        {message.text}
      </div>
    )
  }

  return (
    <div className="notification">
      {message.text}
    </div>
  )
}

const Filter = ({ filterText, setFilterText }) => {
  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }
  return <div>filter shown with <input value={filterText} onChange={handleFilterChange} /></div>
}

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, persons, setPersons, notify }) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(pers => pers.id !== person.id ? pers : returnedPerson))
            setNewName('')
            setNewNumber('')
            notify(`Updated ${returnedPerson.name}`)
          })
          .catch(() => {
            setNewName('')
            setNewNumber('')
            notify(
              `Information of '${person.name}' has already been removed from server`, true
            )
            setPersons(persons.filter(pers => pers.id !== person.id))
          })

      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        notify(`Added ${returnedPerson.name}`)
      })

  }

  return <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
}

const Persons = ({ persons, setPersons, filterText, notify }) => {
  const handleDeleteButtonClick = (id, name) => () => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => personService.getAll()).then(initialPersons => {
          setPersons(initialPersons)
          notify(`Deleted ${name}`)
        })
        .catch(() => {
          notify(
            `Information of '${name}' has already been removed from server`, true
          )
          setPersons(persons.filter(pers => pers.id !== id))
        })
    }
  }
  return persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))
    .map(person => <p key={person.id}>{person.name} {person.number} <button onClick={handleDeleteButtonClick(person.id, person.name)}>delete</button></p>)
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])
  const notify = (text, error = false) => {
    setNotification({ text, error })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} persons={persons} setPersons={setPersons} notify={notify} />
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filterText={filterText} notify={notify} />
    </div>
  )
}

export default App
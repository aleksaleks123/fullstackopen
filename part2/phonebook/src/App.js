import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filterText, setFilterText }) => {
  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }
  return <div>filter shown with <input value={filterText} onChange={handleFilterChange} /></div>
}

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, persons, setPersons }) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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

const Persons = ({ persons, filterText }) =>
  persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase())).map(person => <p key={person.name}>{person.name} {person.number}</p>)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Persons persons={persons} filterText={filterText} />
    </div>
  )
}

export default App
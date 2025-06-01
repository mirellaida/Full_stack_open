import { useState, useEffect } from 'react'
//import axios from 'axios'
import nameService from './services/names'
import "./index.css"


const Notification = ({message}) => {
  if (!message) return null
  return <div className="message">{message}</div>
}


const App = (props) => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterPerson, setFilterPerson] = useState('')
  const [filteredPerson,setFilteredPerson] = useState([])
  const [message, setMessage] = useState('')

  useEffect(()=> {
    console.log('effect')
    nameService.getAll().then((initialPerson) => {
       console.log('promise fulfilled')
       setPersons(initialPerson)
       setFilteredPerson(initialPerson)
    })
  }, [])
  console.log("render", persons.length, "persons")


    const addNames = (event) => {
    event.preventDefault()
  console.log(event.target)

const existingName = persons.find((person)=>person.name.toLowerCase() === newName.toLowerCase())

  const nameObject = {
    name: newName,
    number: newNumber
  }

if(existingName) {
  const known = window.confirm(`${existingName.name} is already added to phonebook, replace the old number with a new one?`)
  
  if (!known) {
    return
  }

   nameService.update(existingName.id, nameObject).then((updatedPerson) => {
      setPersons(persons.map(p => p.id === existingName.id ? updatedPerson : p))
      setFilteredPerson(filteredPerson.map(p => p.id === existingName.id ? updatedPerson : p))
      setNewName('')
      setNewNumber('')
    })
      } else {
    nameService.create(nameObject).then(returnedPerson => {
    console.log(returnedPerson)

    setPersons(persons.concat(returnedPerson))
    setFilteredPerson(filteredPerson.concat(returnedPerson))
    setNewName('')
    setNewNumber('')
    setMessage(`Added ${returnedPerson.name}`)
    setTimeout(() => {
      setMessage("")
    },4000)
    })
  }
}

const deleteName = (id, name) => {

  const confirmDelete = window.confirm(`Delete ${name} ?`)
  if (!confirmDelete) {
    return
  }
  nameService.remove(id).then(()=>{
   setPersons(persons.filter(person=>person.id !== id))
   setFilteredPerson(filteredPerson.filter(person=>person.id !== id))
  })
}

const handleNewName = (event) => {
  console.log(event.target.value)
  setNewName(event.target.value)
}

const handleNewNumber = (event) => {
  console.log(event.target.value)
  setNewNumber(event.target.value)
}

const handleFilterPerson = (event) => {
  console.log(event.target.value)
  setFilterPerson(event.target.value)

const filterItems = persons.filter((person) => 
  person.name.toLowerCase().includes(event.target.value.toLowerCase()))

setFilteredPerson(filterItems)
}

const Names = ({person, deleteName}) => {
  return <div>{person.name} {person.number}
  <button onClick={()=>deleteName(person.id, person.name)}>delete</button>
  </div>

}

  return (
    <div>
        <h2>Phonebook</h2>
        <Notification message = {message}/>
        <div>
          filter shown with <input value={filterPerson} onChange={handleFilterPerson}/>
        </div>
      <form onSubmit={addNames}>
        <h2>add a new</h2>
        <div>
          name: <input value={newName} onChange={handleNewName}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPerson.map((person)=> {
      return <Names key={person.id} person={person} deleteName={deleteName}/>
      })}
    </div>
  )
}

export default App

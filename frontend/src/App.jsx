import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import RenderPersons from './components/RenderPersons'
import personService from './services/person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilterWoord] = useState('')
  const [confirmMessage, setConfirmMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {    
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
      .catch(error => {
        setErrorMessage(
          `couldn't find the phonebook`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName && person.number === newNumber)) {
      window.alert(`${newName} is already in the phonebook`)
    }
    else if (persons.some(person => person.name === newName)) {
      const personToUpdate = persons.find(person => person.name === newName)
      const changedPerson = {...personToUpdate, number: newNumber}
      if(window.confirm(`${personToUpdate.name} is already in the phonebook, do you want to update the number?`)){
        console.log(changedPerson)
        personService
          .update(personToUpdate.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
            setNewName('')
            setNewNumber('')
            setConfirmMessage(
              `${returnedPerson.name}'s number was successfully changed`
            )
            setTimeout(() => {
              setConfirmMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${personToUpdate.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
    else {
      const personObject = {
        name: newName,
        id: persons.length + 1,
        number: newNumber
      }
      
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setConfirmMessage(
            `${returnedPerson.name} was successfully added`
          )
          setTimeout(() => {
            setConfirmMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `${personObject.name} couldn't be added to the phonebook`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setFilterWoord(event.target.value.toLowerCase())
  }

  const deletePerson = person => {
    if(window.confirm(`Delete ${person.name}`)) {
      personService
        .deletePerson(person.id)
        .then( () => {
          setPersons(persons.filter(p => p.id !== person.id));
          setConfirmMessage(
            `'${person.name}' was removed from server`
          )
          setTimeout(() => {
            setConfirmMessage(null)
          }, 5000)
        }
        )
        .catch(error => {
          setErrorMessage(
            `${person.name} couldn't be removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)        
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={confirmMessage} status='confirm'/>
      <Notification message={errorMessage} status='error'/>
      <Filter value={filter} onChange={handleFilter}/>
      <h2>Add a new person</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <RenderPersons 
        persons={persons} 
        filter={filter} 
        deletePerson={deletePerson}
      />

    </div>
  )
}

export default App
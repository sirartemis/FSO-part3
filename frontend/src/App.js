import { useEffect, useState } from 'react'
import person from './services/persons'

const Filter = ({filter,setFilter}) => (
  <>
    filter shown with
    <input value={filter} onChange={event => setFilter(event.target.value)} />
  </>
)

const Notification = ({message}) => {
  const messageStyle = {
    padding: '5px',
    margin: '5px',
    border: '3px solid green',
    borderRadius: '5px',
    backgroundColor: '#dddada',
    color: 'green',
    fontSize: '18px',
  }

  const errorMessageStyle = {
    ...messageStyle,
    color: 'red',
    borderColor: 'red'
  }

  if (message) {
    return (
      <div style={
        {
          access: messageStyle,
          error: errorMessageStyle
        }[message.style]
      }>
        {message.text}
      </div>
    )
  }
}

const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  addPerson
}) => (
  <form>
   <div>
     name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/>
     <br />
     number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
   </div>
   <div>
     <button onClick={event => addPerson(event)} type="submit">add</button>
   </div>
  </form>
)

const Persons = ({filter, persons, deletePerson}) => {

  const regex = new RegExp(filter, 'i')

  const personList = 
    persons
      .filter(person => filter.length > 0 ? regex.exec(person.name) : 'no ramen no life')
      .map(contact => 
        <li key={contact.id}>
          {contact.name}
          {' '}
          {contact.number}
          {' '}
          <button onClick={(event) => deletePerson(event,contact.id)} >
            delete
          </button>
        </li>
      )

  return (
    <ul style={{ listStyleType: 'none'}}>
      {personList.length > 0 ? personList : '...'}
    </ul>
  )
} 

const App = () => {

  const [message, setMessage] = useState(null)
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const notify = (message, style) => {
    setMessage({text: message, style: style || 'access'})
    setTimeout(() => setMessage(null), 5000)
  }

  const refreshPersons = () => {
    person
      .getAll()
      .then(data => setPersons(data))
  }

  const addPerson = event => {

    event.preventDefault()

    const existingPerson = persons.filter(contact => contact.name === newName)
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    if (existingPerson.length !== 0) {
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      && person
        .update(existingPerson[0].id, newPerson)
        .then(response => {
          clearForm()
          setPersons(persons.map(contact => contact.id !== existingPerson[0].id ? contact : response))
          notify(`Updated ${newName}`)
        })
        .catch(() => {
          notify(`Information of ${newName} has already been removed from server`, 'error')
          refreshPersons()
        })
    } else
    if (newName && newNumber) {
      person
        .create(newPerson)
        .then(refreshPersons())
      clearForm()
      notify(`Added ${newName}`)
    }
  }

  const deletePerson = (event, id) => {

    event.preventDefault()

    const targetPerson = persons.filter(contact => contact.id === id)[0].name
    window.confirm(`delete ${targetPerson}?`)
     && person
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(contact => contact.id !== id))
        notify(`Deleted ${targetPerson}`)
      })
      .catch(() => {
        notify(`Information of ${targetPerson} has already been removed from server`, 'error')
        refreshPersons()
      })
  }

  useEffect(() => {
    refreshPersons()
  },[])
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter 
        filter={filter}
        setFilter={setFilter}
      />
      <h3>add a new</h3>
      <PersonForm 
        newNumber={newNumber}
        newName={newName}
        setNewNumber={setNewNumber} 
        setNewName={setNewName} 
        addPerson={addPerson} 
      />
      <h3>Numbers</h3>
      <Persons 
        filter={filter}
        persons={persons}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App

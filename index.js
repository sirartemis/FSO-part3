const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const id = Math.floor(Math.random() * 1000000)
    if (persons.filter(p => p.id === id).length > 0) return generateId()
    return id
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const quantity = `Phonebook has info for ${persons.length} people`
    const time = new Date()

    response.send(`<p>${quantity}</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons.find(p => p.id === id) 
        ? response.json(persons.filter(p => p.id === id)) 
        : response.send('Person not found')
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons.find(p => p.id === id)
        ? (persons = persons.filter(p => p.id !== id)) && response.send('Person deleted')
        : response.send('Person not found')
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.json({error: "person must have a name"})
    }
    if (!person.number) {
        return response.json({error: "person must have a number"})
    }
    if (persons.filter(p => p.name === person.name).length > 0) {
        return response.json({error: "name must be unique"})
    }

    persons = [
        ...persons,
        {
            ...person,
            id: generateId()
        }
    ]
    response.send('person added')
})

app.listen(PORT)
console.log(`Server is running on port ${PORT}`)

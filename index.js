const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
morgan.token('person_name', (req) => req.body.name || '')
morgan.token('person_number', (req) => req.body.number || '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {"name":":person_name", "number":":person_number"}'))
let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  time = new Date()
  personsNumber = persons.length
  console.log(time)
  response.send(`<p>Phonebook has info for ${personsNumber} people</p>
                 <p>${time}</p>`)
})

app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if(person){
    response.json(person)
  } else {
    response.status(404).json({error: "Person not found"})
  }
})

app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post(`/api/persons`, (request, response) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'make sure to give a name and number'
    })
  }
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'person already in database'
    })
  }

  const id = String(Math.floor(Math.random()*10000));

  const person = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

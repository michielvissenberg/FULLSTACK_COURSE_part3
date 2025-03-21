require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('person_name', (req) => req.body.name || '')
morgan.token('person_number', (req) => req.body.number || '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {"name":":person_name", "number":":person_number"}'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const time = new Date()

  Person.find({}).then(persons => {
    const personsNumber = persons.length

    response.send(`<p>Phonebook has info for ${personsNumber} people</p>
                   <p>${time}</p>`)
  }).catch(error => next(error))
})

app.get(`/api/persons/:id`, (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete(`/api/persons/:id`, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id) 
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
    })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'Make sure to give a name and number' });
  }

  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: 'Person already in database' });
    }

    const person = new Person({
      name,
      number,
    });

    person.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error));  
  }).catch(error => next(error)); 
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({error: 'malformatted id'})
  } 
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

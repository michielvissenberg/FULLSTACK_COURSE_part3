const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Person', personSchema)

// if (process.argv.length == 5) {
//     const namePerson = process.argv[3]
//     const numberPerson = process.argv[4]
//     console.log(namePerson)
//     const person = new Person({
//         name: namePerson,
//         number: numberPerson,
//     })
//     person.save().then(result => {
//         console.log(`added ${namePerson} number: ${numberPerson} to the phonebook`)
//         mongoose.connection.close()
//     })
// } else {
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//     })
// }

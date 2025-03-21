const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

if (process.argv.length > 3 && process.argv.length < 5) {
    console.log('incorrect arguments')
    process.exit(1)
} 

const url = `mongodb+srv://michiel:${password}@phonebook.ttrpa.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebook` 

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
    const namePerson = process.argv[3]
    const numberPerson = process.argv[4]
    console.log(namePerson)
    const person = new Person({
        name: namePerson,
        number: numberPerson,
    })
    person.save().then(result => {
        console.log(`added ${namePerson} number: ${numberPerson} to the phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

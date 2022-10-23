const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[3]

const url = `mongodb+srv://sirartemis:${password}@cluster0.yco9n.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected')

            if ( process.argv.length > 3) {
                const [name, number] = [process.argv[3],process.argv[4]]

                const person = new Person({
                    name,
                    number
                })
                return person.save()
            }

            Person.find({}).then(() => {
                result.map( r => console.log(r))
            })
        })
        .then(() => {
            return  mongoose.connection.close()
        })
        .catch(err => console.log(err))


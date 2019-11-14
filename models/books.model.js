const mongoose = require('mongoose')
const schema = mongoose.Schema

const bookSchema = new schema({
    name: String,
    genre: String,
    authorId: String,
})

module.exports = mongoose.model('Book', bookSchema)

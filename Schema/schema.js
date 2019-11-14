const graphql = require('graphql'),
    {
        GraphQLObjectType,
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull,
    } = graphql,
    _ = require('lodash'),
    Book = require('../models/books.model'),
    Author = require('../models/author.model')

//Dummy data
// const books = [
//     { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
//     { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
//     { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//     { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//     { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//     { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
// ]

// var authors = [
//     { name: 'Patrick Rothfuss', age: 44, id: '1' },
//     { name: 'Brandon Sanderson', age: 42, id: '2' },
//     { name: 'Terry Pratchett', age: 66, id: '3' },
// ]

/**
 * DEFINE OBJECT TYPES
 */
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            //One to One Association of a book to a author
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId })
                return Author.findOne({ _id: parent.authorId })
            },
        },
    }),
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            //One to to many association of an author to many books
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id })
                return Book.find({ authorId: parent._id })
            },
        },
    }),
})

/**
 * DEFINE ROOT QUERIES
 * Root queries serve as entry points to fetch data
 */

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } }, //arguments represeneting a data for a specific book
            resolve(parent, args) {
                //code to get data from db
                // return _.find(books, { id: args.id })
                return Book.findOne({ _id: args.id })
            },
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id })
                return Author.findOne({ _id: args.id })
            },
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find()
            },
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find()
            },
        },
    },
})

/**
 * DEFINE MUTATIONS
 * Mutations allow us to make changes to data
 */
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age,
                })
                return author.save()
            },
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                })
                return book.save()
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})

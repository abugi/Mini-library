const express = require('express')
const app = express()
const graphqlHTTP = require('express-graphql') //this package allows express to integrate with graphql
const schema = require('./Schema/schema')
const mongoose = require('mongoose')

mongoose.connect(
    'mongodb://localhost:27017/graphqlserver',
    // 'mongodb://graphql-server:test123@ds053317.mlab.com:53317/graphql-server',
    { useNewUrlParser: true },
    function(err) {
        if (err) throw err
        console.log('connected to DB')
    }
)

/**
 *this middleware directs all requests coming into the "/graphql" endpoint
 * and graphql function handles the request the graphql way
 */
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(4000, () => {
    console.log('live on port 4000')
})

const { ApolloServer } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDef');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const PORT = process.env.port || 5001;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
        return server.listen({ port: PORT });
    }).then(res => {
        console.log(`Server running at ${res.url}`)
    }).catch(err=>{
        console.error(err)
    })
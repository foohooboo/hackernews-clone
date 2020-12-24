const { PrismaClient } = require("@prisma/client")
const { ApolloServer, PubSub } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { info } = require('console');
// const Mutation = require('./resolvers/Mutation')
// const Query = require('./resolvers/Query')
const Subscription = require('./resolvers/Subscription')
// const User = require('./resolvers/User')
// const Link = require('./resolvers/Link')


const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        link: async (parent, args, context) => {
            return context.prisma.link.findUnique({
                where: {
                    id: parseInt(args.id),
                },
            })
        },
    },
    Mutation: {
        post: (parent, args, context, info) => {
            return context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
        },
        updateLink: (parent, args, context, info) =>{
            return context.prisma.link.update({
                where: {
                    id: parseInt(args.id)
                },
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
        },
        deleteLink: (parent, args, context, info) =>{
            return context.prisma.link.delete({
                where: {
                    id: parseInt(args.id)
                },
            })
        },
    },
    Subscription,
}

const prisma = new PrismaClient()
const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
        };
    }
});

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    );
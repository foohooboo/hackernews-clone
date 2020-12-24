const { PrismaClient } = require("@prisma/client")
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { info } = require('console');


const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        link: async (parent, args, context) => {
            context.prisma.link.find()
        }
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
    },
}

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    );
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
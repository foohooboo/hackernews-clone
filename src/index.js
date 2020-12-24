const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let dummyLinks = [
    {
        id: 'link-0',
        url: 'www.google.com',
        description: 'It looks stuff up good.'
    },
    {
        id: 'link-1',
        url: 'www.facebook.com',
        description: 'The bane and benifit of modern thought sharing.'
    },
]

let idCount = dummyLinks.length
const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        link: (parent, args) => dummyLinks.find(link => link.id === args.id),
        feed: () => dummyLinks,
        count: () => dummyLinks.length,
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            dummyLinks.push(link)
            return dummyLinks[dummyLinks.length - 1]
        },
        updateLink: (parent, args) => {
            let index = dummyLinks.findIndex(link => link.id === args.id)
            if(index > -1){
                args.url ? dummyLinks[index].url = args.url : null
                args.description ? dummyLinks[index].description = args.description : null
            }
            return dummyLinks[index]
        },
        deleteLink: (parent, args) => {
            let index = dummyLinks.findIndex(link => link.id === args.id)
            let link = dummyLinks[index]
            if(link) {
                dummyLinks.splice(index, 1)
            }
            return link
        },
    },
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
})

server
    .listen()
    .then(({ url }) => 
        console.log('Server is running on {url}')
    );
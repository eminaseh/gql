const express = require('express')
const expressGraphQl = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const app = express()

const autori = [
    {
        id: 1,
        ime: 'Lav Nikolajevič Tolstoj',
        drzava: 'Rusija'
    },
    {
        id: 2,
        ime: 'Stiven King',
        drzava: 'SAD'
    },
    {
        id: 3,
        ime: 'J. R. R. Tolkin',
        drzava: 'Velika Britanija'
    }
]

const knjige = [
    {
        id: 1,
        naziv: 'Prstenova družina',
        autorId: 3,
        godina: 1949
    },
    {
        id: 2,
        naziv: 'Rat i mir',
        autorId: 1,
        godina: 1869
    },
    {
        id: 3,
        naziv: 'Dvije kule',
        autorId: 3,
        godina: 1954
    },
    {
        id: 4,
        naziv: 'Povratak kralja',
        autorId: 3,
        godina: 1955
    },
    {
        id: 5,
        naziv: 'Ana Karenjina',
        autorId: 1,
        godina: 1874
    },
    {
        id: 6,
        naziv: 'Isijavanje',
        autorId: 2,
        godina: 1978
    },
    {
        id: 7,
        naziv: 'Keri',
        autorId: 2,
        godina: 1974
    },
    {
        id: 8,
        naziv: 'Bijes',
        autorId: 2,
        godina: 1977
    }
]


const knjigaType = new GraphQLObjectType({
    name: 'Knjiga',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        naziv: {type: GraphQLNonNull(GraphQLString)},
        autorId: {type: GraphQLInt},
        godina: {type: GraphQLNonNull(GraphQLInt)},
        autor: {
            type: autorType,
            resolve: (knjiga) => {
                return autori.find(autor => autor.id === knjiga.autorId)
            }
        }
    })
})

const autorType = new GraphQLObjectType({
    name: 'Autor',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        ime: {type: GraphQLNonNull(GraphQLString)},
        drzava: {type: GraphQLNonNull(GraphQLString)},
        knjige: {
            type: new GraphQLList(knjigaType),
            resolve: (autor) => {
                return knjige.filter(knjiga => knjiga.autorId === autor.id)
            }

        }


    })
})



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        knjige: {
            type: new GraphQLList(knjigaType),
            resolve: () => knjige
        },
        autori: {
            type: new GraphQLList(autorType),
            resolve: () => autori
        },
        knjiga: {
            type: knjigaType,
            args:{
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => knjige.find(knjiga => knjiga.id === args.id)
        },
        autor: {
            type: autorType,
            args:{
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => autori.find(autor => autor.id === args.id)
        }

    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
    dodajKnjigu:{
        type: knjigaType,
        args: {
            naziv: {type: GraphQLNonNull(GraphQLString)},
            autorId: {type: GraphQLNonNull(GraphQLInt)},
            godina: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve: (parent, args) => {
            const knjiga = {id: knjige.length + 1, naziv: args.naziv, autorId: args.autorId, godina: args.godina}
            knjige.push(knjiga)
            return knjiga
        }
    }
})
})
//mutation
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQl({
    schema: schema,
    graphiql: true
}))
app.listen(5000.,() => console.log('Server Running'))

const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type Post {
        _id: ID!
        title: String!
        content: String!
        image: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type AuthUser {
        token: String!
        userId: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthUser!
    }

    input UserData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userData: UserData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    projects: [Project]
  }

  type Project {
    id: ID!
    title: String!
    description: String
    status: String!
    owner: User
  }

  type Query {
    getMe: User
    getAllProjects: [Project]
    getProject(id: ID!): Project
  }

  type Mutation {
    createProject(title: String!, description: String): Project
    updateProjectStatus(id: ID!, status: String!): Project
  }
`;

module.exports = typeDefs;
const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Result {
    message: String!
  }

  type Mutation {
    generateProject(
      framework: String!
      language: String!
      projectName: String!
    ): Result
  }
`;

module.exports = typeDefs;

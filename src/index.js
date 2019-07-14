const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const path = require("path");
const resolvers = require("./resolvers");
const { prisma } = require("./generated/prisma-client");

const typeDefs = importSchema(path.resolve("src/schema.graphql"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => ({
    req,
    prisma
  })
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

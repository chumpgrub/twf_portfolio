import ApolloClient from "apollo-boost"

export const client = new ApolloClient({
  uri: `https://twf.markfurrow.com/graphql`,
})

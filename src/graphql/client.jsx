import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
const { REACT_APP_ADMIN_SECRET } = process.env;
console.log(REACT_APP_ADMIN_SECRET);

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://ck-apollo-music-share.hasura.app/v1/graphql",
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: {
        headers: {
          "x-hasura-admin-secret": `${REACT_APP_ADMIN_SECRET}`,
        },
      },
    },
  }),
  cache: new InMemoryCache(),
});

export default client;

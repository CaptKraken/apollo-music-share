import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { GET_QUEUED_SONGS } from "./queries";
const { REACT_APP_ADMIN_SECRET } = process.env;

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
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      url: String!
      duration: Float!
    }

    type Query {
      queue: [Song]!
    }

    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      url: String!
      duration: Float!
    }

    type Mutation {
      addOrRemoveFromQueue(input: songInput): [Song]!
    }
  `,

  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS,
        });
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queue.filter((song) => song.id !== input.id)
            : [...queue, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue },
          });
          return newQueue;
        }
      },
    },
  },
});

const hasQueue = Boolean(localStorage.getItem("queue"));

client.writeQuery({
  query: GET_QUEUED_SONGS,
  data: { queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : [] },
});

export default client;

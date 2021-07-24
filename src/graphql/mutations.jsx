import { gql } from "@apollo/client";

export const ADD_SONG = gql`
  mutation addSong(
    $artist: String!
    $title: String!
    $thumbnail: String!
    $url: String!
    $duration: Float!
  ) {
    insert_songs(
      objects: {
        artist: $artist
        title: $title
        thumbnail: $thumbnail
        url: $url
        duration: $duration
      }
    ) {
      affected_rows
    }
  }
`;

export const ADD_OR_REMOVE_FROM_QUEUE = gql`
  mutation addOrRemoveFromQueue($input: SongInput!) {
    addOrRemoveFromQueue(input: $input) @client
  }
`;

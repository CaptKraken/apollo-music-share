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

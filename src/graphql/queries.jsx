import { gql } from "@apollo/client";

export const GET_SONGS = gql`
  subscription getSongs {
    songs(order_by: { created_at: desc }) {
      url
      title
      thumbnail
      id
      duration
      artist
    }
  }
`;

export const GET_QUEUED_SONGS = gql`
  query getQueuedSong {
    queue @client {
      id
      duration
      title
      artist
      thumbnail
      url
    }
  }
`;

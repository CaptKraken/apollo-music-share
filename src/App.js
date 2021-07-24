import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, useMediaQuery, Hidden } from "@material-ui/core";
import { createContext } from "react";
import { useContext } from "react";
import { useReducer } from "react";
import songReducer from "./reducer";

export const SongContext = createContext({
  song: {
    id: "48e1d4f2-458d-4bd1-83ed-96e7562f2d4f",
    title: "Lune",
    artist: "Moon",
    thumbnail: "http://img.youtube.com/vi/--ZtUFsIgMk/0.jpg",
    url: "https://www.youtube.com/watch?v=--ZtUFsIgMk",
    duration: 228,
  },
  isPlaying: false,
});

function App() {
  const initialSongState = useContext(SongContext);
  const [state, dispatch] = useReducer(songReducer, initialSongState);
  const isGreaterThanMedium = useMediaQuery((theme) =>
    theme.breakpoints.up("md")
  );
  const isGreaterThanSmall = useMediaQuery((theme) =>
    theme.breakpoints.up("sm")
  );

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only="xs">
        <Header />
      </Hidden>
      <Grid
        container
        spacing={3}
        style={{
          paddingTop: isGreaterThanSmall ? 80 : 10,
        }}
      >
        <Grid item xs={12} md={7}>
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          style={
            isGreaterThanMedium
              ? {
                  position: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70,
                }
              : {
                  position: "fixed",
                  width: "100%",
                  left: 0,
                  bottom: 0,
                }
          }
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;

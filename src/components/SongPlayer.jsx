import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  makeStyles,
  Slider,
  Typography,
} from "@material-ui/core";
import { Pause, PlayArrow, SkipNext, SkipPrevious } from "@material-ui/icons";
import { useContext } from "react";
import { SongContext } from "../App";
import { GET_QUEUED_SONGS } from "../graphql/queries";
import QueuedSongList from "./QueuedSongList";
import ReactPlayer from "react-player";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: "0 15px",
  },
  content: {
    flex: "1 0 auto",
  },
  thumbnail: {
    width: 150,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

const SongPlayer = () => {
  const { data } = useQuery(GET_QUEUED_SONGS);
  const { state, dispatch } = useContext(SongContext);
  const classes = useStyles();
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const reactPlayerRef = useRef();

  const [positionInQueue, setPositionInQueue] = useState(0);
  useEffect(() => {
    const songIndex = data.queue.findIndex((song) => song.id === state.song.id);
    setPositionInQueue(songIndex);
  }, [data.queue, state.song.id]);

  useEffect(() => {
    const nextSong = data.queue[positionInQueue + 1];
    if (played === 1 && nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }, [data.queue, played, dispatch, positionInQueue]);

  const handleTogglePlay = () => {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  };

  const handleProgressChange = (e, newValue) => {
    setPlayed(newValue);
  };
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };
  const handleSeekMouseUp = () => {
    reactPlayerRef.current.seekTo(played);
    setSeeking(false);
  };

  const formatDuration = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  const handlePlayPrevious = () => {
    const previousSong = data.queue[positionInQueue - 1];
    if (previousSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: previousSong } });
    }
  };
  const handlePlayNext = () => {
    const nextSong = data.queue[positionInQueue + 1];
    if (nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  };

  return (
    <>
      <Card variant="outlined" className={classes.container}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h3">
              {state.song.title}
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {state.song.artist}
            </Typography>
          </CardContent>

          <div className={classes.controls}>
            <IconButton onClick={handlePlayPrevious}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handleTogglePlay}>
              {state.isPlaying ? (
                <Pause className={classes.playIcon} />
              ) : (
                <PlayArrow className={classes.playIcon} />
              )}
            </IconButton>
            <IconButton onClick={handlePlayNext}>
              <SkipNext />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {formatDuration(playedSeconds)}
            </Typography>
          </div>
          <Slider
            value={played}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            onChange={handleProgressChange}
            type="range"
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <ReactPlayer
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          ref={reactPlayerRef}
          url={state.song.url}
          playing={state.isPlaying}
          hidden
        />
        <CardMedia image={state.song.thumbnail} className={classes.thumbnail} />
      </Card>
      <QueuedSongList queue={data?.queue} />
    </>
  );
};

export default SongPlayer;

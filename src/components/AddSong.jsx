import { useMutation } from "@apollo/client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { AddBoxOutlined, Link } from "@material-ui/icons";
import { useEffect } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import SoundCloudPlayer from "react-player/soundcloud";
import YouTubePlayer from "react-player/youtube";
import { ADD_SONG } from "../graphql/mutations";
import { GET_SONGS } from "../graphql/queries";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  urlInput: {
    margin: theme.spacing(1),
  },
  addSongButton: {
    margin: theme.spacing(1),
  },
  dialog: {
    textAlign: "center",
  },
  thumbnail: {
    width: "90%",
  },
}));
const initSongState = {
  duration: 0,
  title: "",
  artist: " author",
  thumbnail: "",
};

const AddSong = () => {
  const [url, setUrl] = useState("");
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    const isPlayable =
      SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);

    setPlayable(isPlayable);
  }, [url]);

  const [song, setSong] = useState(initSongState);
  const [dialog, setDialog] = useState(false);
  const classes = useStyles();
  const [addSong, { error }] = useMutation(ADD_SONG);

  function handleCloseDialog() {
    setDialog(false);
  }

  const handleChangeSong = (e) => {
    const { name, value } = e.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  };

  const handleEditSong = async ({ player }) => {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYTinfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSCinfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  };

  const handleAddSong = async () => {
    try {
      const { url, thumbnail, duration, title, artist } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
        },
      });
      handleCloseDialog();
      setSong(initSongState);
      setUrl("");
    } catch (error) {
      console.log(error);
    }
  };

  const getYTinfo = (player) => {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;

    console.log(duration, title, author, thumbnail);
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  };

  const getSCinfo = (player) => {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  };

  const handleError = (field) => {
    return error?.graphQLErrors[0]?.extensions?.path?.includes(field);
  };

  const { title, artist, thumbnail } = song;
  return (
    <div className={classes.container}>
      <Dialog
        className={classes.dialog}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img
            src={thumbnail}
            alt={`${title} - ${artist}`}
            className={classes.thumbnail}
          />
          <TextField
            margin="dense"
            name="title"
            label="Title"
            onChange={handleChangeSong}
            value={title}
            error={handleError("title")}
            helperText={handleError("title") && "fill out field."}
            fullWidth
          />
          <TextField
            margin="dense"
            name="artist"
            label="Artist"
            onChange={handleChangeSong}
            value={artist}
            error={handleError("artist")}
            helperText={handleError("artist") && "fill out field."}
            fullWidth
          />
          <TextField
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            onChange={handleChangeSong}
            value={thumbnail}
            error={handleError("thumbnail")}
            helperText={handleError("thumbnail") && "fill out field."}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="outlined" color="primary" onClick={handleAddSong}>
            Add Song
          </Button>
        </DialogActions>
      </Dialog>

      <TextField
        className={classes.urlInput}
        placeholder="add Youtube or Soundcloud url"
        fullWidth
        margin="normal"
        onChange={(e) => setUrl(e.target.value)}
        value={url}
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={!playable}
        className={classes.addSongButton}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
        onClick={() => setDialog(true)}
      >
        ADD{" "}
      </Button>

      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
};

export default AddSong;

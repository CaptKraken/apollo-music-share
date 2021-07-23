import {
  Avatar,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const QueuedSongList = () => {
  const isGreaterThanMedium = useMediaQuery((theme) =>
    theme.breakpoints.up("md")
  );
  const song = {
    title: "lune",
    artist: "moon",
    thumbnail: "http://img.youtube.com/vi/--ZtUFsIgMk/0.jpg",
  };

  return (
    isGreaterThanMedium && (
      <div
        style={{
          margin: "10px 0",
        }}
      >
        <Typography color="textSecondary" varian="button">
          QUEUE (5)
        </Typography>
        {Array.from({ length: 5 }, () => song).map((song, i) => (
          <QueuedSong song={song} />
        ))}
      </div>
    )
  );
};

const useStyles = makeStyles({
  avatar: {
    width: 44,
    height: 44,
  },
  text: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  container: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    gap: 12,
    alignItems: "center",
    marginTop: 10,
  },
  songInfoContainer: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
});

function QueuedSong({ song }) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Avatar src={song.thumbnail} className={classes.avatar} />
      <div className={classes.songInfoContainer}>
        <Typography variant="subtitle2" className={classes.text}>
          {song.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.text}
        >
          {song.artist}
        </Typography>
      </div>
      <IconButton>
        <Delete color="secondary" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;

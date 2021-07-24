import { useMutation } from "@apollo/client";
import {
  Avatar,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const QueuedSongList = ({ queue }) => {
  console.log(queue);
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
          QUEUE ({queue.length})
        </Typography>
        {queue.map((song) => (
          <QueuedSong key={song.id} song={song} />
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
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });
  const handleAddOrRemoveFromQueue = () => {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } },
    });
  };

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
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <Delete color="secondary" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;

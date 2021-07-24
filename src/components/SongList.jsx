import { useQuery } from "@apollo/client";
import {
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Typography,
  CardActions,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { PlayArrow, Save } from "@material-ui/icons";
import { GET_SONGS } from "../graphql/queries";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3),
  },
  songInfoContainer: {
    display: "flex",
    alignItems: "center",
  },
  songInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  thumbnail: {
    objectFit: "cover",
    width: 140,
    height: 140,
  },
}));

const SongList = () => {
  const { data, loading, error } = useQuery(GET_SONGS);

  console.log(data);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (error) return <div>Error fetching songs.{error}</div>;

  return (
    <div>
      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
};

function Song({ song }) {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <div className={classes.songInfoContainer}>
        <CardMedia image={song.thumbnail} className={classes.thumbnail} />
        <div className={classes.songInfo}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {song.title}
            </Typography>
            <Typography variant="body1" component="p" color="textSecondary">
              {song.artist}
            </Typography>
          </CardContent>

          <CardActions>
            <IconButton size="small" color="primary">
              <PlayArrow />
            </IconButton>
            <IconButton size="small" color="secondary">
              <Save />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;

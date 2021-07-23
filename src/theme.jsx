import { createTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

const theme = createTheme({
  palette: {
    type: "dark",
    primary: teal,
    secondary: red,
  },
});

export default theme;

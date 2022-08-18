import { createTheme } from "@mui/material";

export default createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
        margin: "dense",
        fullWidth: true,
        InputLabelProps: {
          shrink: true,
          color: "primary",
        },
      },
    },
  },
});

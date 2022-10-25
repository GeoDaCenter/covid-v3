import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import colors from "./config/colors";

const theme = createTheme({
  typography: {
    fontFamily: "'Lato', sans-serif",
  },
  palette: {
    type: "dark",
    background: {
      default: "#000000",
    },
    text: {
      primary: "#fff6f6",
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: colors.yellow,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffcc00",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  overrides: {
    // MuiTooltip: {
    //   borderRadius: 0,
    //   tooltip: {
    //     borderRadius: 0,
    //   },
    // },
    // MuiPopper: {
    //   borderRadius: 0,
    //   tooltip: {
    //     borderRadius: 0,
    //   },
    // },
    // MuiInputLabel: {
    //   root: {
    //     color: 'white'
    //   }
    // },
    // MuiOutlinedInput: {
    //   root: {
    //     borderColor: 'white',
    //     background: 'red'
    //   },
    // },
    MuiInputLabel: {
      outlined: {
        color: "white",
      },
    },
    MuiInputBase: {
      root: {
        color: "red",
      },
      input: {
        borderColor: "red",
      },
    },
  },
});

export const MuiThemeProvider = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);

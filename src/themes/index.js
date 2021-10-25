// import defaultTheme from "./default";

// import { createMuiTheme } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
// const primary = '#005ae5';
// const secondary = '#191c31';
// const warning = "#ff924f";
// const success = "#58bf88";
// const info = "#9013FE";
// const sidebar = '#252945';
const error = '#ff6391'


// 7578e1
// primary : #005ae5
//  Background : #191c31

// sidebar : #252945
// white : #ffffff
// failure : #ff6391
//black : #000000
//adc1:#6cd8ba
//adc2:#f6bb65
//adc3:#c55b75
//adc4:#7578e1
//adc5:#d687ff
//adc6:#ffc3c2
//adc7:#fff8a8

// Warning: #ff924f

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3f53d9',
    },
    secondary: {
      main: '#191c31'
    },
    warning: {
      main: red[500]
    },
    success: {
      main: '#ffff'
    },
    error: {
      main: '#ff6391'
    },
    info: {
      main: "#9013FE"
    },
    myColor: {
      main: '#ffe'
    }
  },
  typography: {
    fontFamily: [
      'Asap',
    ].join(','),
  },
  breakpoints: {
    values: {
      xs: 300,
      sm: 600,
      md: 960,
      mdx: 1100,
      lg: 1280,
      llg: 1440,
      xlx: 1640,
      xl: 1920
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
      },
    },
  },

});
export default theme;

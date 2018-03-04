// MT: A place to store object styles for our MUI theme.
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { purple200, pinkA700, purple500, purpleA700 } from 'material-ui/styles/colors';

const Theme = getMuiTheme(darkBaseTheme, {
  fontFamily: 'Open Sans, sans-serif',
  palette: {
    primary1Color: 'rgb(224, 176, 255)',
    primary2Color: purple200,
    primary3Color: pinkA700,
    accent1Color: 'rgb(161, 92, 230)',
    accent2Color: purple500,
    accent3Color: purpleA700,
    cardColor: purple200
  },
  appBar: {
    color: 'rgb(70, 70, 70)',
    textColor: 'white'
  },
  paper: {
    backgroundColor: 'rgb(70, 70, 70)'
  }
});

export default Theme;

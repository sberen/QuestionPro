import React from 'react';
import { MainPage }  from './Components/MainPage/MainPage'
import {Theme, createMuiTheme, ThemeProvider} from '@material-ui/core';
import "./App.css";

const theme : Theme = createMuiTheme({
  typography: {
    fontFamily: 'Arial,Roboto'
  },
  palette: {
    primary: {
      main: "#0d47a1"
    },
    secondary: {
      main: "#fafafa"
    },
  }
});

// The top level component that displays the
// Application and defines the theme
export class App extends React.Component {
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <MainPage />
        </ThemeProvider>
      </div>  
    );
  }

}


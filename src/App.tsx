import React from 'react';
import { MainPage }  from './Components/MainPage/MainPage'
import {Theme, createMuiTheme, ThemeProvider} from '@material-ui/core';
import { green, blue } from '@material-ui/core/colors';
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
    }
  }
});


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


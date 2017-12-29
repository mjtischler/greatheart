import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginButton from './Components/LoginButton/LoginButton';
import './App.css';

class App extends Component {
  componentDidMount () {
    // MT: Re-enable when ready to access APIs
    // fetch('/users')
    //   .then(res => res.json())
    //   .then(users => this.setState({ users }));
  }

  render () {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to Greatheart</h1>
            <LoginButton></LoginButton>
          </header>
          <p className="App-intro">
            Please sign up for an account or login above.
          </p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

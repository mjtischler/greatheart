import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import './App.css';

class App extends Component {
  componentDidMount () {
  }

  render () {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Router>
            <Switch>
              <Route exact path="/" component={() => <Home />}/>
              <Route exact path="/profile" component={() => <Profile />}/>
              <Route path="*" component={() => <Home />} />
            </Switch>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// MT: We'll pass down to all of our shared styles to our components for propagation throughout the component structure.
import SharedStyles from './Styles/SharedStyles';
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
              <Route exact path="/" component={() => <Home sharedStyles={SharedStyles} />}/>
              <Route exact path="/profile" component={() => <Profile sharedStyles={SharedStyles} />}/>
              <Route path="*" component={() => <Home sharedStyles={SharedStyles} />} />
            </Switch>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

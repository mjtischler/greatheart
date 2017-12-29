import React, { Component } from 'react';
import './Profile.css';

class App extends Component {
  // componentDidMount () {
  //   fetch('/users')
  //     .then(res => res.json())
  //     .then(users => this.setState({ users }));
  // }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Greatheart</h1>
        </header>
        <p className="App-intro">
          Please sign up for an account or login above.
        </p>
      </div>
    );
  }
}

export default App;

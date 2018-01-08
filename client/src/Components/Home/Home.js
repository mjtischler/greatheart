import React, { Component } from 'react';
import LoginButton from '../Common/LoginButton/LoginButton';
import Posts from '../Posts/Posts';
import './Home.css';

class Home extends Component {
  render () {
    return (
      <div>
        <header className="Home-header">
          <h1 className="Home-title">Greatheart</h1>
          <LoginButton></LoginButton>
        </header>
        <p className="Home-intro">
          Please sign up for an account or login above.
        </p>
        <Posts></Posts>
      </div>
    );
  }
}

export default Home;

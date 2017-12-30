import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
  render () {
    return (
      <div>
        <header className="Profile-header">
          <h1 className="Profile-title">Welcome to Greatheart</h1>
        </header>
        <p>
          Welcome to your profile!
        </p>
      </div>
    );
  }
}

export default Profile;

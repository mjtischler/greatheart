import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import LogoutButton from '../Common/LogoutButton/LogoutButton';
import './Profile.css';

const styles = {
  progressLoader: {
    position: 'absolute',
    top: '44%',
    left: '48%'
  }
};

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      profileData: []
    };
  }

  componentDidMount () {
    fetch('/api/user', {
      method: 'GET',
      credentials: 'include'
    }).then(response => response.json()).then(response => {
      if (response.status === 'OK') {
        const profileData = [];
        profileData.push(response.result);

        this.setState({
          loaded: true,
          profileData
        });
      } else {
        window.location = '/';
      }
    });
  }

  render () {
    if (!this.state.loaded) {
      return <CircularProgress
              size={80}
              thickness={7}
              style={styles.progressLoader}
             />;
    }

    return (
      <div>
        <header className="Profile-header">
          <h1 className="Profile-title">Greatheart</h1>
          <LogoutButton></LogoutButton>
        </header>
        <p>
          Welcome to your profile,
          {this.state.profileData.map(profile =>
            <span key={profile.userId}>{profile.userName}, {profile.email}</span>
          )}
        </p>
      </div>
    );
  }
}

export default Profile;

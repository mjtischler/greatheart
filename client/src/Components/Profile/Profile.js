import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import LogoutButton from '../Common/LogoutButton/LogoutButton';
import AddPost from './Components/AddPost/AddPost';
import {Card, CardHeader} from 'material-ui/Card';
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

    if (this.state.profileData[0].isAdmin) {
      return (
        <div>
          <header className="Profile-header">
            <h1 className="Profile-title">Greatheart</h1>
            <LogoutButton></LogoutButton>
          </header>
          <div className="Profile-container">
            <AddPost></AddPost>
            <Card>
              {this.state.profileData.map(profile =>
                <CardHeader
                  key={profile.userId}
                  title={profile.userName}
                  subtitle={profile.email}
                />
              )}
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div>
        <header className="Profile-header">
          <h1 className="Profile-title">Greatheart</h1>
          <LogoutButton></LogoutButton>
        </header>
        <div className="Profile-container">
          <Card>
            {this.state.profileData.map(profile =>
              <CardHeader
                key={profile.userId}
                title={profile.userName}
                subtitle={profile.email}
              />
            )}
          </Card>
        </div>
      </div>
    );
  }
}

export default Profile;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import TitleBar from '../Common/TitleBar/TitleBar.jsx';
import AddPost from './Components/AddPost/AddPost.jsx';
import Footer from '../Common/Footer/Footer.jsx';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Posts from '../Posts/Posts.jsx';
import '../Home/Home.css';
import './Profile.css';

class Profile extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      profileData: [],
      openModal: false,
      status: null,
      message: null,
      redirectLocation: null
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
    }).catch(() => {
      window.location = '/';
    });
  }

  render () {
    if (!this.state.loaded) {
      return <CircularProgress
        size={80}
        thickness={7}
        style={this.props.sharedStyles.progressLoader}
      />;
    }

    return (this.state.profileData[0].isAdmin ?
      <div className="Profile">
        <div className="Profile-header">
          <TitleBar
            loaded={ this.state.loaded }
            isLoggedIn={ true }
          />
        </div>
        <div className="Profile-container">
          <div className="Profile-addPost">
            <AddPost></AddPost>
          </div>
          <div className="Profile-userInfo">
            <Card>
              {this.state.profileData.map(profile =>
                <CardHeader
                  key={ profile.userId }
                  title={ profile.userName }
                  subtitle={ profile.email }
                />
              )}
            </Card>
          </div>
        </div>
        <div className="Profile-footer">
          <Footer />
        </div>
      </div>
      :
      <div className="Profile">
        <div className="Profile-header">
          <TitleBar
            loaded={ this.state.loaded }
            isLoggedIn={ true }
          />
        </div>
        <div className="Profile-container">
          <div className="Profile-viewPosts">
            <Posts
              sharedStyles={ this.props.sharedStyles }
            />
          </div>
          <div className="Profile-userInfo">
            <Card>
              {this.state.profileData.map(profile =>
                <CardHeader
                  key={ profile.userId }
                  title={ profile.userName }
                  subtitle={ profile.email }
                />
              )}
            </Card>
          </div>
        </div>
        <div className="Profile-footer">
          <Footer />
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  sharedStyles: PropTypes.object
};

export default Profile;

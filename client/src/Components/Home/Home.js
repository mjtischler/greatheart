import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import LogoutButton from '../Common/LogoutButton/LogoutButton';
import LoginButton from '../Common/LoginButton/LoginButton';
import Posts from '../Posts/Posts';
import './Home.css';

class Home extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      isLoggedIn: false
    };
  }

  componentDidMount () {
    // MT: Let's check to see if the user is logged in. If they're not, or an error is returned, let's render the page anyways.
    fetch('/api/user', {
      method: 'GET',
      credentials: 'include'
    }).then(response => response.json()).then(response => {
      if (response.status === 'OK') {
        this.setState({
          loaded: true,
          isLoggedIn: true
        });
      } else {
        this.setState({
          loaded: true,
        });
      }
    }).catch(() => {
      this.setState({
        loaded: true
      });
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

    return (
      <div>
        <header className="Home-header">
          <h1 className="Home-title">Greatheart</h1>
          { this.state.isLoggedIn ? <LogoutButton></LogoutButton> : <LoginButton></LoginButton> }
        </header>
        { this.state.isLoggedIn ? null :
          <p className="Home-intro">
            Please sign up for an account or login above.
          </p>
        }
        <Posts
          sharedStyles={this.props.sharedStyles}
        />
      </div>
    );
  }
}

Home.propTypes = {
  sharedStyles: PropTypes.object
};

export default Home;

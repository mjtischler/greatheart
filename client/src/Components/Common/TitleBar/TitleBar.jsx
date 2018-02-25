import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import LogoutButton from '../LogoutButton/LogoutButton.jsx';
import LoginButton from '../LoginButton/LoginButton.jsx';
import './TitleBar.css';

const AppBarTitle = () => {
  const titleStart = 'Great';
  const titleEnd = 'Heart';
  const title = <div className="TitleBar-title">
    <span>{ titleStart }</span>
    <span className="TitleBar-titleEnd">{ titleEnd }</span>
  </div>;

  return title;
};

class TitleBar extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: props.loaded,
      isLoggedIn: props.isLoggedIn
    };
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className="TitleBar">
        <AppBar
          title={ <AppBarTitle /> }
          className="TitleBar-header"
          iconElementLeft={
            <img className="TitleBar-appBarIcon" src="/assets/gh-logo_128.png" alt="Welcome to Greatheart"/>
          }
          iconElementRight={
            <div className="TitleBar-loginButton">
              { this.state.isLoggedIn ? <LogoutButton></LogoutButton> : <LoginButton></LoginButton> }
            </div>
          }
        />
      </div>
    );
  }
}

TitleBar.propTypes = {
  loaded: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

export default TitleBar;

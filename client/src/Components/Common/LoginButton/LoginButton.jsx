import React, { Component } from 'react';
import InfoModal from '../InfoModal/InfoModal.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import './LoginButton.css';

const LoginButtonStyles = {
  popover: {
    backgroundColor: 'rgb(138, 138, 138)'
  },
  button: {
    color: 'white',
    width: 100
  },
  divider: {
    backgroundColor: 'rgb(176, 176, 176)',
    marginLeft: 20,
    marginRight: 20
  },
  hintStyle: {
    color: 'white'
  }
};

class LoginButton extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false,
      loginEmail: null,
      loginPassword: null,
      signupEmail: null,
      signupPassword: null,
      signupPasswordReentry: null,
      errors: {
        validation: null,
        loginEmail: null,
        loginPassword: null,
        signupGeneric: null,
        signupEmail: null,
        signupUsername: null
      },
      openModal: false,
      status: null,
      message: null,
      redirectLocation: null
    };

    this.handleValidationErrors = this.handleValidationErrors.bind(this);
    this.clearValidationErrors = this.clearValidationErrors.bind(this);
    this.handleMasterButtonClick = this.handleMasterButtonClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.handleSignupButtonClick = this.handleSignupButtonClick.bind(this);
  }

  handleValidationErrors (error) {
    // MT: Reset the errors state when the function is called.
    this.clearValidationErrors();

    switch (error) {
      case 'Login is invalid.':
        this.setState({
          errors: Object.assign(this.state.errors, {loginEmail: error})
        });
        break;
      case 'Email address not found.':
        this.setState({
          errors: Object.assign(this.state.errors, {loginEmail: error})
        });
        break;
      case 'Password is incorrect.':
        this.setState({
          errors: Object.assign(this.state.errors, {loginPassword: error})
        });
        break;
      case 'All fields must be filled out, and the passwords must match and contain at least 6 characters.':
        this.setState({
          errors: Object.assign(this.state.errors, {signupGeneric: error})
        });
        break;
      case 'Email address already exists.':
        this.setState({
          errors: Object.assign(this.state.errors, {signupEmail: error})
        });
        break;
      case 'Username has been taken.':
        this.setState({
          errors: Object.assign(this.state.errors, {signupUsername: error})
        });
        break;
      default:
    }
  }

  clearValidationErrors () {
    this.setState({
      errors: Object.assign(this.state.errors, {
        validation: null,
        loginEmail: null,
        loginPassword: null,
        signupGeneric: null,
        signupEmail: null,
        signupUsername: null
      })
    });
  }

  handleMasterButtonClick (event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose () {
    // MT: Clear validation errors when closing the menu.
    this.clearValidationErrors();

    this.setState({
      open: false
    });
  }

  handleTextFieldChange ({target}) {
    this.setState({
      [target.id]: target.value
    });
  }

  handleLoginButtonClick (event) {
    event.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        loginEmail: this.state.loginEmail,
        loginPassword: this.state.loginPassword
      }),
      headers: {'Content-Type': 'application/json'}
    }).then(response => response.json()).then(response => {
      // MT: A successful login will return a redirected bool of 'true', triggering the loading of the profile page.
      if (response.redirected) {
        window.location = '/profile';
      } else if (response.message) {
        // MT: If we receive a message, it means that the user's account has been disabled. Alert them, then redirect.
        this.setState({
          open: false,
          openModal: true,
          status: response.status,
          message: response.message,
          redirectLocation: '/'
        });
      } else {
        this.handleValidationErrors(response.message);
      }
    }).catch(() => {
      this.setState({
        open: false,
        openModal: true,
        status: 'ERROR',
        message: 'Oh no! There was an issue logging you in.',
        redirectLocation: '/'
      });
    });
  }

  handleSignupButtonClick (event) {
    event.preventDefault();

    fetch('/api/signup', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        signupEmail: this.state.signupEmail,
        signupUsername: this.state.signupUsername,
        signupPassword: this.state.signupPassword,
        signupPasswordReentry: this.state.signupPasswordReentry
      }),
      headers: {'Content-Type': 'application/json'}
    }).then(response => response.json()).then(response => {
      // MT: A successful login will return a redirected bool of 'true', triggering the loading of the profile page.
      if (response.redirected) {
        window.location = '/profile';
      } else {
        this.handleValidationErrors(response.message);
      }
    });
  }

  render () {
    return (
      <div>
        { this.state.openModal ?
          <InfoModal
            open={ this.state.openModal }
            status={ this.state.status }
            message={ this.state.message }
            redirectLocation={ this.state.redirectLocation }
          /> : false
        }
        <RaisedButton
          primary={ true }
          className="LoginButton-button"
          style={ LoginButtonStyles.button }
          onClick={ this.handleMasterButtonClick }>
          <i className="fas fa-sign-in-alt"></i>
          &nbsp; or &nbsp;
          <i className="fas fa-user-plus"></i>
        </RaisedButton>

        <Popover
          className="Login-menu"
          style={ LoginButtonStyles.popover }
          open={ this.state.open }
          anchorEl={ this.state.anchorEl }
          anchorOrigin={ {horizontal: 'right', vertical: 'bottom'} }
          targetOrigin={ {horizontal: 'right', vertical: 'top'} }
          onRequestClose={ this.handleRequestClose }
        >
          <Menu>
            <div className="LoginButton-login-pane">
              <TextField
                id="loginEmail"
                className="LoginButton-textfield"
                hintStyle={ LoginButtonStyles.hintStyle }
                hintText="Email"
                fullWidth={ true }
                type="text"
                onChange={ this.handleTextFieldChange }
                errorText={ this.state.errors.loginEmail }
              /><br />
              <TextField
                id="loginPassword"
                className="LoginButton-textfield"
                hintStyle={ LoginButtonStyles.hintStyle }
                hintText="Password"
                fullWidth={ true }
                type="password"
                onChange={ this.handleTextFieldChange }
                errorText={ this.state.errors.loginPassword }
              /><br />
              <RaisedButton
                primary={ true }
                className="LoginButton-menu-button"
                onClick={ this.handleLoginButtonClick }
              >
                Login
              </RaisedButton>
            </div>
            <Divider style={ LoginButtonStyles.divider }/>
            <div className="LoginButton-signup-pane">
              <TextField
                id="signupEmail"
                className="LoginButton-textfield"
                hintStyle={ LoginButtonStyles.hintStyle }
                hintText="Email"
                fullWidth={ true }
                type="text"
                onChange={ this.handleTextFieldChange }
                errorText={ this.state.errors.signupEmail }
              /><br />
              <TextField
                id="signupUsername"
                className="LoginButton-textfield"
                hintStyle={ LoginButtonStyles.hintStyle }
                hintText="Username"
                fullWidth={ true }
                type="text"
                onChange={ this.handleTextFieldChange }
                errorText={ this.state.errors.signupUsername }
              /><br />
              <TextField
                id="signupPassword"
                className="LoginButton-textfield"
                hintStyle={ LoginButtonStyles.hintStyle }
                hintText="Password"
                fullWidth={ true }
                type="password"
                onChange={ this.handleTextFieldChange }
              /><br />
              <TextField
                id="signupPasswordReentry"
                className="LoginButton-textfield"
                hintStyle={ LoginButtonStyles.hintStyle }
                hintText="Repeat Password"
                fullWidth={ true }
                type="password"
                onChange={ this.handleTextFieldChange }
                errorText={ this.state.errors.signupGeneric }
              /><br />
              <RaisedButton
                primary={ true }
                className="LoginButton-menu-button"
                onClick={ this.handleSignupButtonClick }
              >
                Sign Up
              </RaisedButton>
            </div>
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default LoginButton;

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import './LoginButton.css';

const styles = {
  button: {
    color: 'white',
    width: 140
  },
  divider: {
    backgroundColor: 'rgb(176, 176, 176)',
    marginLeft: 20,
    marginRight: 20
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
      signupPasswordReentry: null
    };

    this.handleMasterButtonClick = this.handleMasterButtonClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.handleSignupButtonClick = this.handleSignupButtonClick.bind(this);
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
    // MT: Pass values to API
  }

  handleSignupButtonClick (event) {
    event.preventDefault();

    // MT: Pass values to API
  }

  render () {
    return (
      <div className="LoginButton-container">
        <RaisedButton primary={true} style={styles.button} onClick={this.handleMasterButtonClick}>
          Login or Signup
        </RaisedButton>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
            <div className="LoginButton-login-pane">
              <TextField
                id="loginEmail"
                hintText="Email"
                fullWidth={true}
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="loginPassword"
                hintText="Password"
                fullWidth={true}
                type="password"
                onChange={this.handleTextFieldChange}
              /><br />
              <RaisedButton primary={true} className="LoginButton-menu-button" onClick={this.handleLoginButtonClick}>
                Login
              </RaisedButton>
            </div>
            <Divider style={styles.divider}/>
            <div className="LoginButton-signup-pane">
              <TextField
                id="signupEmail"
                hintText="Email"
                fullWidth={true}
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="signupPassword"
                hintText="Password"
                fullWidth={true}
                type="password"
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="signupPasswordReentry"
                hintText="Repeat Password"
                fullWidth={true}
                type="password"
                onChange={this.handleTextFieldChange}
              /><br />
            <RaisedButton primary={true} className="LoginButton-menu-button" onClick={this.handleSignupButtonClick}>
                Sign Up
              </RaisedButton>
            </div>
        </Popover>
      </div>
    );
  }
}

export default LoginButton;

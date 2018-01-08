import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './LogoutButton.css';

const styles = {
  button: {
    color: 'white',
    width: 90
  }
};

class LogoutButton extends Component {
  handleMasterButtonClick (event) {
    // This prevents ghost click.
    event.preventDefault();

    fetch('/api/logout', {
      method: 'GET',
      credentials: 'include'
    }).then(response => response.json()).then(response => {
      // MT: We're going to redirect the user regardless of the server's status and deal with the error server-side.
      if (response.redirected) {
        window.location = '/';
      } else {
        alert('There was an error logging out.');
        window.location = '/';
      }
    });
  }

  render () {
    return (
      <div className="LogoutButton-container">
        <RaisedButton primary={true} style={styles.button} onClick={this.handleMasterButtonClick}>
          Log out
        </RaisedButton>
      </div>
    );
  }
}

export default LogoutButton;

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import InfoModal from '../InfoModal/InfoModal';
import './LogoutButton.css';

const styles = {
  button: {
    color: 'white',
    width: 90
  }
};

class LogoutButton extends Component {
  constructor (props) {
    super(props);

    this.state = {
      openModal: false,
      status: null,
      message: null,
      redirectLocation: null
    };

    this.handleMasterButtonClick = this.handleMasterButtonClick.bind(this);
  }

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
        this.setState({
          openModal: true,
          status: 'ERROR',
          message: 'There was an issue logging you out. Whoops!',
          redirectLocation: '/'
        });
      }
    }).catch(() => {
      this.setState({
        openModal: true,
        status: 'ERROR',
        message: 'There was an issue logging you out. Whoops!',
        redirectLocation: '/'
      });
    });
  }

  render () {
    return (
      <div>
        {this.state.openModal ?
          <InfoModal
            open={this.state.openModal}
            status={this.state.status}
            message={this.state.message}
            redirectLocation={this.state.redirectLocation}
          /> : false
        }
        <div className="LogoutButton-container">
          <RaisedButton primary={true} style={styles.button} onClick={this.handleMasterButtonClick}>
            Log out
          </RaisedButton>
        </div>
      </div>
    );
  }
}

export default LogoutButton;

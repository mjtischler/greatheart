import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// MT: A resuable modal for sitewide application.
class InfoModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: props.open,
      status: props.status,
      message: props.message,
      redirectLocation: props.redirectLocation
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount () {
    this.setState({
      open: this.props.open,
      status: this.props.status,
      message: this.props.message,
      redirectLocation: this.props.redirectLocation
    });
  }

  handleClose () {
    this.setState({ open: false });

    if (this.state.redirectLocation) {
      window.location = this.state.redirectLocation;
    }
  }

  render () {
    const actions = [
      <FlatButton
        key={0}
        label="GOT IT"
        primary={ true }
        onClick={ this.handleClose }
      />
    ];

    return (
      <div>
        <Dialog
          title={ this.state.status }
          actions={ actions }
          modal={ true }
          open={ this.state.open }
        >
          { this.state.message }
        </Dialog>
      </div>
    );
  }
}

InfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  redirectLocation: PropTypes.string
};

export default InfoModal;

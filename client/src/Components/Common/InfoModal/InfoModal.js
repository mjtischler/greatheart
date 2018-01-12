import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class InfoModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: props.open,
      status: props.status,
      message: props.message
    };

    this.handleClose = this.handleClose.bind(this);
  }

  // MT: If the component is expecting properties, we need to prepare it to do so. This will watch for incoming properties and adjust the state accordingly.
  componentWillReceiveProps (nextProps) {
    this.setState({
      open: nextProps.open,
      status: nextProps.status,
      message: nextProps.message
    });
  }

  handleClose () {
    this.setState({open: false});
  }

  render () {
    const actions = [
      <FlatButton
        key={0}
        label="GOT IT"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <Dialog
          title={this.state.status}
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          {this.state.message}
        </Dialog>
      </div>
    );
  }
}

InfoModal.propTypes = {
  open: PropTypes.bool,
  status: PropTypes.string,
  message: PropTypes.string
};

export default InfoModal;

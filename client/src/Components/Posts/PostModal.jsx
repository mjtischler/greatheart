import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// MT: A resuable modal for sitewide application.
class PostModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: props.open,
      status: props.status,
      message: props.message,
      close: props.close
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount () {
    this.setState({
      open: this.props.open,
      status: this.props.status,
      message: this.props.message,
      close: this.props.close
    });
  }

  // MT: A function to render HTML embedded in returned JSON.
  createMarkup (markup) {
    return { __html: markup };
  }


  handleClose () {
    this.state.close();
  }

  render () {
    const actions = [
      <FlatButton
        key={0}
        label="CLOSE"
        primary={ true }
        onClick={ this.handleClose }
      />
    ];

    return (
      <div>
        <Dialog
          title={ this.state.status }
          titleClassName="postModal-title"
          actions={ actions }
          modal={ false }
          open={ this.state.open }
          onRequestClose={ () => this.handleClose() }
          autoScrollBodyContent={ true }
        >
        <div dangerouslySetInnerHTML={ this.createMarkup(this.state.message) }></div>
        </Dialog>
      </div>
    );
  }
}

PostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  message: PropTypes.any.isRequired,
  close: PropTypes.func.isRequired
};

export default PostModal;

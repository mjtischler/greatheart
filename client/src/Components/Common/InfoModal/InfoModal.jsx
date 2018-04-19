import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ImageCropper from '../ImageCropper/ImageCropper';
import FileUpload from '../FileUpload/FileUpload';

// MT: A resuable modal for sitewide application.
class InfoModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: props.open,
      status: props.status,
      message: props.message,
      redirectLocation: props.redirectLocation,
      disableButton: props.disableButton,
      croppedImage: null,
      openCropper: props.openCropper,
      disableActions: null,
      getCroppedImage: props.getCroppedImage
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleCroppedImage = this.handleCroppedImage.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
    this.handleButtonEnable = this.handleButtonEnable.bind(this);
  }

  componentDidMount () {
    this.setState({
      open: this.props.open,
      status: this.props.status,
      message: this.props.message,
      redirectLocation: this.props.redirectLocation,
      disableButton: this.props.disableButton,
      openCropper: this.props.openCropper,
      enablebutton: this.state.handleButtonEnable,
      disableActions: this.state.disableActions,
      getCroppedImage: this.props.getCroppedImage
    });

    // if (this.state.openCropper) {
    //   // MT: This is a conditional import, and will likely throw a linter error. That's ok; we just want to import
    //   // the ImageCropper if necessary, and not introduce overhead when it's not required by the modal.
    //   import('../ImageCropper/ImageCropper')
    //     .then((ImageCropper) => {
    //        console.log(ImageCropper);
    //     });
    // }
  }

  handleClose (event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      open: false,
      status: null,
      message: null,
      redirectLocation: null,
      disableButton: null,
      openCropper: false
    });

    if (this.state.redirectLocation) {
      window.location = this.state.redirectLocation;
    }
  }

  handleCroppedImage (image) {
    this.setState({
      croppedImage: image
    });
  }

  handleInteraction (event) {
    if (event) {
      event.preventDefault();
    }

    if (this.state.croppedImage) {
      this.handleClose();

      this.setState({
        open: true,
        status: 'Image is uploading',
        message: 'Please wait...',
        disableActions: true
      }, () => FileUpload(this.state.croppedImage).then((resolve, reject) => {
        if (resolve) {
          this.handleClose();

          this.state.getCroppedImage(resolve.fileLocation);
        } else {
          // MT: Handle error
          console.log('reject', reject);
        }
      })
      );
    }
  }

  handleButtonEnable () {
    this.setState({
      disableButton: false
    });
  }

  render () {
    const actions = [
      <div key={ 0 }>
        { this.state.openCropper ?
          <div>
            <FlatButton
              key={ 1 }
              label="Cancel"
              primary={ true }
              onClick={ this.handleClose }
            />
            <FlatButton
              key={ 2 }
              label="Upload"
              primary={ true }
              disabled={ this.state.disableButton }
              onClick={ this.handleInteraction }
            />
          </div> :
          <FlatButton
            key={ 3 }
            label="GOT IT"
            primary={ true }
            disabled={ this.state.disableButton }
            onClick={ this.handleClose }
          />
        }
      </div>
    ];

    return (
      <div>
        <Dialog
          title={ this.state.status }
          actions={ this.state.disableActions ? null : actions }
          modal={ true }
          open={ this.state.open }
        >
          { this.state.message }
          { this.state.openCropper ?
            <ImageCropper
              handleButtonEnable={ this.handleButtonEnable }
              handleCroppedImage={ this.handleCroppedImage }
            /> : null}
        </Dialog>
      </div>
    );
  }
}

InfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  status: PropTypes.string,
  message: PropTypes.string,
  redirectLocation: PropTypes.string,
  disableButton: PropTypes.bool,
  openCropper: PropTypes.bool
};

export default InfoModal;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import InfoModal from '../../../Common/InfoModal/InfoModal.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ReactQuill from 'react-quill';
import '../../../../Styles/Quill.css';
import './AddPost.css';

const AddPostStyles = {
  postHeaderText: {
    width: '97%'
  },
  cardHeaderText: {
    padding: 0
  }
};

class AddPost extends Component {
  constructor (props) {
    super(props);

    this.getCroppedImage = this.getCroppedImage.bind(this);

    this.state = {
      postHeaderText: null,
      postBodyText: null,
      image: null,
      imagePreviewUrl: null,
      imageAdded: false,
      imageIsUploading: false,
      openModal: false,
      status: null,
      message: null,
      redirectLocation: null,
      openCropper: false,
      imageURL: null,
      getCroppedImage: this.getCroppedImage
    };

    this.handleHeaderChange = this.handleHeaderChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmitPostButtonClick = this.handleSubmitPostButtonClick.bind(this);
    this.openCropperModal = this.openCropperModal.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  }

  handleHeaderChange ({target}) {
    this.handleErrors();

    this.setState({
      [target.id]: target.value
    });
  }

  handleBodyChange (body) {
    this.handleErrors();

    this.setState({ postBodyText: body });
  }

  handleSubmitPostButtonClick (event) {
    // This prevents ghost click.
    event.preventDefault();
    this.handleErrors();

    fetch('/api/admin/addPost', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        postHeaderText: this.state.postHeaderText,
        postBodyText: this.state.postBodyText
      }),
      headers: {'Content-Type': 'application/json'}
    }).then(response => response.json()).then(response => {
      if (response.redirected === 'true') {
        if (this.state.openCropper) {
          this.setState({
            openModal: false,
            openCropper: false,
            status: null,
            disableButton: false
          }, () => {
            this.setState({
              openModal: true,
              status: 'WELL DONE!',
              message: 'Your post was added successfully.',
              redirectLocation: '/profile'
            });
          });
        } else {
          this.setState({
            openModal: true,
            status: 'WELL DONE!',
            message: 'Your post was added successfully.',
            redirectLocation: '/profile'
          });
        }
      } else if (response.status === 'ERROR') {
        this.setState({
          openModal: true,
          status: response.status,
          message: response.message
        });
      } else {
        this.setState({
          openModal: true,
          status: 'ERROR',
          message: 'An unknown error occurred. Dang.',
          redirectLocation: '/profile'
        });
      }
    }).catch(() => {
      this.setState({
        openModal: true,
        status: 'ERROR',
        message: 'There was an issue communicating with the server. We\'re gonna send you home now.',
        redirectLocation: '/'
      });
    });
  }

  openCropperModal (event) {
    event.preventDefault();

    this.setState({
      openModal: false,
      openCropper: false,
      status: null,
      disableButton: false,
      imageAdded: false
    }, () => {
      this.setState({
        openModal: true,
        openCropper: true,
        status: 'Crop your image',
        disableButton: true,
      });
    });
  }

  getCroppedImage (image) {
    this.setState({
      image: image,
    });
  }

  handleErrors () {
    // MT: Reset the error message once the modal has been closed.
    if (this.state.openModal && this.state.status && this.state.message) {
      this.setState({
        openModal: false,
        status: null,
        message: null,
        openCropper: false,
        disableButton: false
      });
    }
  }

  componentDidMount () {
  }

  render () {
    return (
      <div>
        {/*
          MT: Render the modal when the AddPost's openModal state changes, and pass the necessary properties into the dialog.
        */}
        { this.state.openModal ?
          <InfoModal
            open={ this.state.openModal }
            status={ this.state.status }
            message={ this.state.message }
            redirectLocation={ this.state.redirectLocation }
            openCropper={ this.state.openCropper }
            getCroppedImage={ this.state.openCropper ? this.state.getCroppedImage : null }
            disableButton={ this.state.disableButton }
          /> : false
        }
        <Card>
          <CardHeader
            textStyle={ AddPostStyles.cardHeaderText }
            title="Add Post"
          />
          <TextField
            hintText={ this.state.postHeaderText ? this.state.postHeaderText : 'The header of your post...' }
            defaultValue={ this.state.postHeaderText ? this.state.postHeaderText : null }
            id="postHeaderText"
            maxLength="58"
            style={ AddPostStyles.postHeaderText }
            onChange={ this.handleHeaderChange }
          /><br />
          <RaisedButton
            primary={ true }
            containerElement='label'
            label='Add Image'
            onClick={ this.openCropperModal }>
          </RaisedButton>
          <br />
          <ReactQuill
            id="postBodyText"
            className="AddPost-post-body"
            placeholder={ this.state.postBodyText ? this.state.postHeaderText : 'Your post...' }
            defaultValue={ this.state.postBodyText ? this.state.postBodyText : null }
            onChange={ this.handleBodyChange }>
          </ReactQuill>
          <CardActions>
            <div className="AddPost-card-actions-container">
              <RaisedButton
                className="AddPost-card-actions-button"
                primary={ true }
                label="Post"
                onClick={ this.handleSubmitPostButtonClick }
              />
              <div className="AddPost-card-actions-image-preview-container">
                { this.state.image ?
                  <img className="AddPost-card-actions-image-preview" src={ this.state.image } alt="Upload Preview"></img>
                  : null}
              </div>
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }
}

AddPost.propTypes = {
  progressStyle: PropTypes.object
};


export default AddPost;

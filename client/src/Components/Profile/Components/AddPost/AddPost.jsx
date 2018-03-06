import React, { Component } from 'react';
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

    this.state = {
      postHeaderText: null,
      postBodyText: null,
      image: null,
      imagePreviewUrl: null,
      imageAdded: false,
      openModal: false,
      status: null,
      message: null,
      redirectLocation: null
    };

    this.handleHeaderChange = this.handleHeaderChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleAddedImage = this.handleAddedImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleSubmitPostButtonClick = this.handleSubmitPostButtonClick.bind(this);
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

  handleAddedImage (file) {
    // This prevents ghost click.
    file.preventDefault();
    this.handleErrors();

    const reader = new FileReader();
    const upload = file.target.files[0];

    if (upload.type !== 'image/jpeg') {
      this.setState({
        openModal: true,
        status: 'ERROR',
        message: 'Images must be in JPEG format.'
      });
    } else if (upload.size > 2600000) {
      this.setState({
        openModal: true,
        status: 'ERROR',
        message: 'Images must be less than 2.5MB in size.'
      });
    } else {
      reader.readAsDataURL(upload);

      reader.onloadend = () => {
        this.setState({
          image: upload,
          imagePreviewUrl: reader.result,
          imageAdded: true
        });

        this.uploadImage();
      };
    }
  }

  uploadImage () {
    if (this.state.image) {
      // MT: Append the file into a form to make it readable by the server.
      const data = new FormData();
      data.append('postImage', this.state.image);

      fetch('/api/admin/addImage', {
        method: 'POST',
        credentials: 'include',
        body: data
      }).then(response => response.json()).then(response => {
        if (response.status === 'ERROR') {
          this.setState({
            openModal: true,
            status: response.status,
            message: response.message,
            image: null,
            imageAdded: false
          });
        }
      });
    }
  }

  handleSubmitPostButtonClick (event) {
    // This prevents ghost click.
    event.preventDefault();
    this.handleErrors();

    if (!this.state.image || this.state.imageAdded) {
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
          this.setState({
            openModal: true,
            status: 'WELL DONE!',
            message: 'Your post was added successfully.',
            redirectLocation: '/profile'
          });
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
  }

  handleErrors () {
    // MT: Reset the error message once the modal has been closed.
    if (this.state.openModal && this.state.status && this.state.message) {
      this.setState({
        openModal: false,
        status: null,
        message: null
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
          /> : false
        }
        <Card>
          <CardHeader
            textStyle={ AddPostStyles.cardHeaderText }
            title="Add Post"
          />
          <TextField
            hintText="The header of your post..."
            id="postHeaderText"
            maxLength="58"
            style={ AddPostStyles.postHeaderText }
            onChange={ this.handleHeaderChange }
          /><br />
          <RaisedButton
            primary={ true }
            className="AddPost-add-image-button"
            containerElement='label'
            label='Add Image'
            onClick={ this.handleErrors }>
              <input type="file" className="AddPost-upload-input" onChange={ this.handleAddedImage } />
          </RaisedButton>
          <span className="AddPost-image-text">{ this.state.image ? this.state.image.name : 'No image selected' }</span>
          <br />
          <ReactQuill
            id="postBodyText"
            className="AddPost-post-body"
            placeholder="Your post..."
            onChange={ this.handleBodyChange }>
          </ReactQuill>
          <CardActions>
            <RaisedButton
              primary={ true }
              label="Submit Post"
              onClick={ this.handleSubmitPostButtonClick }
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default AddPost;

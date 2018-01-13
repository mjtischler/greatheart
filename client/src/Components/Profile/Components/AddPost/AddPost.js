import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import InfoModal from '../../../Common/InfoModal/InfoModal';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './AddPost.css';

const styles = {
  postHeader: {
    width: '96%'
  }
};

class AddPost extends Component {
  constructor (props) {
    super(props);

    this.state = {
      postHeaderText: null,
      postBodyText: null,
      openModal: false,
      status: null,
      message: null,
      redirectLocation: null
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSubmitPostButtonClick = this.handleSubmitPostButtonClick.bind(this);
  }

  handleTextFieldChange ({target}) {
    // MT: Reset the error message once the modal has been closed.
    if (this.state.openModal && this.state.status && this.state.message) {
      this.setState({
        openModal: false,
        status: null,
        message: null
      });
    }
    this.setState({
      [target.id]: target.value
    });
  }

  handleSubmitPostButtonClick (event) {
    // This prevents ghost click.
    event.preventDefault();

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

  componentDidMount () {
  }

  render () {
    return (
      <div>
        {/*
          MT: Render the modal when the AddPost's openModal state changes, and pass the necessary properties into the dialog.
        */}
        {this.state.openModal ?
          <InfoModal
            open={this.state.openModal}
            status={this.state.status}
            message={this.state.message}
            redirectLocation={this.state.redirectLocation}
          /> : false
        }
        <Card>
          <CardHeader
            title="Add Post"
          />
          <TextField
            hintText="The header of your post..."
            id="postHeaderText"
            style={styles.postHeader}
            onChange={this.handleTextFieldChange}
          /><br />
          <textarea
            id="postBodyText"
            className="AddPost-post-body"
            placeholder="Your post..."
            onChange={this.handleTextFieldChange}>
          </textarea>
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          <CardActions>
            <RaisedButton primary={true} label="Submit Post" onClick={this.handleSubmitPostButtonClick} />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default AddPost;

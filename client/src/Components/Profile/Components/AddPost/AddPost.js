import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
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
      postBodyText: null
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSubmitPostButtonClick = this.handleSubmitPostButtonClick.bind(this);
  }

  handleTextFieldChange ({target}) {
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
        alert('Post added successfully!')
        window.location = '/profile'
      } else {
        alert(response.message);
      }
    });
  }

  componentDidMount () {
  }

  render () {
    return (
      <div>
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

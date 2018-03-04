import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardHeader, CardTitle, CardMedia, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { getLocalDate } from '../../Utils/SharedUtils';
import PostModal from './PostModal.jsx';
import Sidebar from './Sidebar/Sidebar.jsx';
import './Posts.css';

class Posts extends Component {
  constructor (props) {
    super(props);

    this.state = {
      openModal: false,
      status: null,
      message: null,
      loaded: false,
      posts: []
    };

    this.openPost = this.openPost.bind(this);
    this.closePost = this.closePost.bind(this);
  }

  componentDidMount () {
    fetch('/api/posts', {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      // MT: We don't want to alter the state, we want to concat our return to the new state.
      if (response.status === 'OK') {
        this.setState(previousState => ({
          posts: previousState.posts.concat(response.posts),
          loaded: true
        }));
      } else {
        this.setState(previousState => ({
          posts: previousState.posts.concat([
            {
              _id: '1',
              postHeaderText: 'We\'re Sorry!',
              postBodyText: 'There are no posts.'
            }
          ]),
          loaded: true
        }));
      }
    })
    .catch(reject => {
      this.setState(previousState => ({
        posts: previousState.posts.concat([
          {
            _id: '1',
            postHeaderText: 'Whoops!',
            postBodyText: 'An error occured while loading posts.',
            rejectMessage: reject.message
          }
        ]),
        loaded: true
      }));
    });
  }

  openPost (post) {
    this.setState({
      openModal: true,
      status: post.postHeaderText,
      message: post.postBodyText
    });
  }

  closePost () {
    this.setState({
      openModal: false,
      status: null,
      message: null
    });
  }

  // MT: A function to render HTML embedded in returned JSON.
  createMarkup (markup) {
    return { __html: markup };
  }

  render () {
    if (!this.state.loaded) {
      return <CircularProgress
        size={80}
        thickness={7}
        style={ this.props.sharedStyles.progressLoader }
      />;
    }

    return (
      <div className="posts-container">
        {/*
          MT: Render the modal when the Posts's openModal state changes, and pass the necessary properties into the dialog.
        */}
        { this.state.openModal ?
          <div className="posts-modalContainer">
            <PostModal
              open={ this.state.openModal }
              status={ this.state.status }
              message={ this.state.message }
              close={ this.closePost }
            />
          </div> : false
        }
        <div className="posts-listItemContainer">
          { this.state.loaded ?
              this.state.posts.map(post =>
                <Card key={ post._id }>
                  <CardTitle
                    className="postHeader"
                    title={ post.postHeaderText }
                  />
                  <CardHeader
                    subtitle={ `${post.postAuthorName} on ${getLocalDate(post.postCreationDate)}` }
                  />
                  <CardMedia className="postImage">
                    <img src={`/posts/images/${post.postImage}`} alt="" />
                  </CardMedia>
                  <CardText className="postText">
                    <div dangerouslySetInnerHTML={ this.createMarkup(post.postBodyText) }></div>
                  </CardText>
                  <CardActions className="postActions">
                    <RaisedButton label="More..." primary={ true } onClick={ () => this.openPost(post) }/>
                  </CardActions>
                </Card>
              )
            : <div>There are no posts.</div>
          }
        </div>
        <Sidebar className="posts-sidebar" />
      </div>
    );
  }
}

Posts.propTypes = {
  sharedStyles: PropTypes.object
};

export default Posts;

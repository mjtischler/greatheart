import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardHeader, CardTitle, CardMedia, CardText} from 'material-ui/Card';
import { getLocalDate } from '../../Utils/SharedUtils';
import './Posts.css';

const postStyle = {
  margin: 20,
  textAlign: 'left',
};

class Posts extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loaded: false,
      posts: []
    };
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

  // MT: A function to render HTML embedded in returned JSON.
  createMarkup (markup) {
    return {__html: markup};
  }

  render () {
    if (!this.state.loaded) {
      return <CircularProgress
        size={80}
        thickness={7}
        style={this.props.sharedStyles.progressLoader}
      />;
    }

    return (
      <div>
        { this.state.loaded ?
            this.state.posts.map(posts =>
              <Card key={ posts._id } style={ postStyle }>
                <CardTitle title={ posts.postHeaderText }/>
                <CardHeader
                  subtitle={ `${posts.postAuthorName} on ${getLocalDate(posts.postCreationDate)}` }
                />
                <CardMedia>
                  <img src={`/posts/images/${posts.postImage}`} alt="" />
                </CardMedia>
                <CardText>
                  <div dangerouslySetInnerHTML={ this.createMarkup(posts.postBodyText) }></div>
                </CardText>
              </Card>
            )
          : <div>There are no posts.</div>
        }
      </div>
    );
  }
}

Posts.propTypes = {
  sharedStyles: PropTypes.object
};

export default Posts;

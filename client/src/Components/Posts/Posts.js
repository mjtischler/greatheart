import React, { Component } from 'react';
// import Paper from 'material-ui/Paper';
import './Posts.css';

const postStyle = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class Posts extends Component {
  constructor (props) {
    super(props);

    // MT: An empty state for future use.
    this.state = {
      posts: []
    };
  }

  componentDidMount () {
    fetch('/api/posts', {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      // MT: We don't want to alter the state, we want to concat our return to the new state.
      this.setState(previousState => ({
        posts: previousState.posts.concat(response.posts)
      }));
    })
    .catch(reject => {
      // MT: Temporary
      console.log('Error: ', reject);
    });
  }

  render () {
    return (
      <div>
        {this.state.posts.map(posts =>
           <div key={ posts._id } style={ postStyle }>
            <p>
              { posts.postHeaderText }
            </p>
            <p>
              { posts.postBodyText }
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Posts;

import React, { Component } from 'react';
import './Posts.css';

class Posts extends Component {
  constructor (props) {
    super(props);

    // MT: An empty state for future use.
    this.state = {
    };
  }

  componentDidMount () {
    fetch('/api/posts', {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      // MT: Temporary.
      console.log(response);
    });
  }

  render () {
    return (
      <div>
        <p>
          Here are the posts.
        </p>
      </div>
    );
  }
}

export default Posts;

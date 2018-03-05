import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  constructor (props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className="Footer">
        <div className="Footer-text">
          <a
            href="https://github.com/mjtischler/greatheart"
            rel='noreferrer noopener'
            target="_blank">
            Copyright &copy; 2018-2019 The GreatHeart Project
          </a>
        </div>
      </div>
    );
  }
}

export default Footer;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'cropperjs/dist/cropper.css';
import './ImageCropper.css';
import Cropper from 'react-cropper';

const styles = {
  cropperContainer: {
    width: '100%'
  },
  cropper: {
    height: 400,
    width: '100%'
  },
  cropperPreviewContainer: {
    width: '50%',
    float: 'right'
  },
  cropperPreview: {
    height: 300,
    width: '100%',
    float: 'left'
  },
  croppedImageContainer: {
    width: '50%',
    float: 'right'
  },
  cropImageButton: {
    float: 'right'
  },
  croppedImage: {
    width: '100%'
  },
  breakLine: {
    clear: 'both'
  }
};

class ImageCropper extends Component {
  constructor (props) {
    super(props);

    this.state = {
      src: null,
      cropResult: null
    };

    this.cropImage = this.cropImage.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount () {
    this.setState({
      handleButtonEnable: this.props.handleButtonEnable
    });
  }

  onChange (event) {
    event.preventDefault();

    let files;

    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.setState({
        src: reader.result,
      });
    };

    reader.readAsDataURL(files[0]);
  }

  cropImage () {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }

    this.state.handleButtonEnable();

    this.setState({
      cropResult: this.cropper.getCroppedCanvas({
        width: 1280,
        height: 720
      }).toDataURL('image/jpeg', 0.7)
    }, () => {
      this.props.handleCroppedImage(this.state.cropResult);
    });
  }

  rotateImage () {
    this.cropper.rotate(-90);
  }

  render () {
    return (
      <div>
        <div style={ styles.cropperContainer }>
          <input type="file" onChange={ this.onChange } />
          <br />
          <br />
          <Cropper
            style={ styles.cropper }
            aspectRatio={ 16 / 9 }
            preview=".image-preview"
            guides={ false }
            src={ this.state.src }
            rotatable={ true }
            ref={cropper => {
              this.cropper = cropper;
            }}
          />
        </div>
        <div>
          <div className="box" style={ styles.cropperPreviewContainer }>
            <h1>Preview</h1>
            <div className="image-preview" style={ styles.cropperPreview } />
          </div>
          <div className="box" style={ styles.croppedImageContainer }>
            <h1>
              <span>Crop</span>
              <button onClick={ this.cropImage } style={ styles.cropImageButton }>
                Crop Image
              </button>
              <button onClick={ this.rotateImage } style={ styles.cropImageButton }>
                Rotate
              </button>
            </h1>
            <img style={ styles.croppedImage } src={ this.state.cropResult } alt="Your Cropped Version" />
          </div>
        </div>
        <br style={ styles.breakLine } />
      </div>
    );
  }
}

ImageCropper.propTypes = {
  handleButtonEnable: PropTypes.func.isRequired,
  handleCroppedImage: PropTypes.func
};

export default ImageCropper;

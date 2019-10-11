import React from 'react';
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface UploadPhotoState {
  src: string | null,
  crop: ReactCrop.Crop | undefined,
  croppedImageUrl: string | undefined,
}

// TODO Test it
class UploadPhoto extends React.PureComponent<{}, UploadPhotoState> {
  imageRef: HTMLImageElement | undefined = undefined;

  fileUrl: string | undefined = undefined;

  onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
          if (typeof reader.result === 'string') {
            this.setState({ src: reader.result })
          }
        },
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  // If you setState the crop in here you should return false.
  onImageLoaded = (target: HTMLImageElement) => {
    this.imageRef = target;
    // Center a square percent crop.
    const width = target.width > target.height ? (target.height / target.width) * 100 : 100;
    const height = target.height > target.width ? (target.width / target.height) * 100 : 100;
    const x = width === 100 ? 0 : (100 - width) / 2;
    const y = height === 100 ? 0 : (100 - height) / 2;

    this.setState({
      crop: {
        unit: '%',
        aspect: 1,
        width,
        height,
        x,
        y,
      },
    });

    return false;
  };

  onCropComplete = (crop: Crop, percentCrop: PercentCrop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop: Crop, percentCrop: PercentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };


  getCroppedImg(image: HTMLImageElement, crop: Crop, fileName: string): Promise<string> {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    if (!crop.width || !crop.height) {
      throw new Error(`crop width ${crop.width} and crop height ${crop.height} must be positive number`)
    }
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not retrieve context')
    }
    if (!crop.x || !crop.y) {
      throw new Error(`crop x: ${crop.x} and crop height ${crop.y} must be positive number`)
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        if (this.fileUrl) {
          window.URL.revokeObjectURL(this.fileUrl);
        }
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  async makeClientCrop(crop: Crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg',
      );
      this.setState({ croppedImageUrl });
    }
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="App">
        <div>
          <input type="file" onChange={this.onSelectFile}/>
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl}/>
        )}
      </div>
    );
  }
}

export default UploadPhoto;

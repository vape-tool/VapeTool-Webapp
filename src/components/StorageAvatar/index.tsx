import * as React from 'react';
import { Avatar } from 'antd';
import { getImageUrl, ImageType } from '@/services/storage';

interface FirebaseImageProps {
  type: ImageType;
  id: string;
}

interface FirebaseImageState {
  src?: string;
}

class FirebaseImage extends React.Component<FirebaseImageProps, FirebaseImageState> {
  state: FirebaseImageState = {
    src: undefined,
  };

  componentDidMount(): void {
    const { type, id } = this.props;
    getImageUrl(type, id)
      .then(src => this.setState({ src }))
      .catch(() => {
      });
  }

  render() {
    const { type } = this.props;
    const { src } = this.state;
    return <Avatar icon="user" alt={type} src={src}/>;
  }
}

export default FirebaseImage;

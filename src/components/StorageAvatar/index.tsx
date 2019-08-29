import * as React from 'react';
import { Avatar } from 'antd';
import { getImageUrl, ImageType } from '@/services/storage';

interface FirebaseImageProps {
  type: ImageType;
  id: string;
  style?: any;
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
    const { type, style } = this.props;
    const { src } = this.state;
    return <Avatar style={style} icon="user" alt={type} src={src}/>;
  }
}

export default FirebaseImage;

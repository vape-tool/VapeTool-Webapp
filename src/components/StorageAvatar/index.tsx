import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { getImageUrl, ImageType } from '@/services/storage';

interface FirebaseImageProps {
  type: ImageType;
  id: string;
  style?: any;
  size?: number | 'small' | 'large' | 'default';
  shape?: 'circle' | 'square';
  className?: any;
  alt?: string;
}

const FirebaseImage: React.FC<FirebaseImageProps> = (props: FirebaseImageProps) => {
  const { type, style, size, shape, className, alt, id } = props;
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    getImageUrl(type, id)
      .then(imageUrl => setSrc(imageUrl))
      .catch(() => {
      });
  }, [id, type]);

  return (
    <Avatar
      style={style}
      icon="user"
      alt={alt || type}
      src={src}
      size={size}
      shape={shape}
      className={className}
    />
  );
};

export default FirebaseImage;

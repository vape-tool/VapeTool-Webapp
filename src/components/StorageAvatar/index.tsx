import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { getImageUrl, ImageType } from '@/services/storage';
import { UserOutlined } from '@ant-design/icons';

interface FirebaseImageProps {
  type: ImageType;
  id: string;
  style?: any;
  size?: number | 'small' | 'large' | 'default';
  shape?: 'circle' | 'square';
  className?: any;
  alt?: string;
}

const FirebaseImage: React.FC<FirebaseImageProps> = ({
  type,
  style,
  size,
  shape,
  className,
  alt,
  id,
}: FirebaseImageProps) => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    getImageUrl(type, id).then((imageUrl) => setSrc(imageUrl));
  }, [id, type]);

  return (
    <Avatar
      style={style}
      icon={<UserOutlined />}
      alt={alt || type}
      src={src}
      size={size}
      shape={shape}
      className={className}
    />
  );
};

export default FirebaseImage;

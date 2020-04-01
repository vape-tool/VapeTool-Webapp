import React from 'react';

export default ({ webp, png, alt, ...props }: any) => (
  <picture>
    <source srcSet={webp} type="image/webp"/>
    <source srcSet={png}/>
    <img src={png} {...props} alt={alt}/>
  </picture>
)

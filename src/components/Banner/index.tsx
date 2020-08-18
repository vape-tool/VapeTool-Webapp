import React, { useEffect, useState } from 'react';
import { getAdImageProperties, BannerProperties, getBannerUrl } from '@/services/storage';
import { useModel } from 'umi';
import { isProUser } from '@/utils/utils';

export default (props: { providerName: string }) => {
  const { initialState } = useModel('@@initialState');
  const { firebaseUser, currentUser } = initialState || {};

  const [bannerProperties, setBannerProperties] = useState<BannerProperties>();
  const [bannerSrc, setBannerSrc] = useState<string | undefined>();
  if (firebaseUser?.isAnonymous || isProUser(currentUser?.subscription)) {
    return <></>;
  }

  useEffect(() => {
    getAdImageProperties(props.providerName).then((_adProperties) => {
      console.log({ _adProperties });
      getBannerUrl(_adProperties).then((_bannerSrc) => {
        setBannerSrc(_bannerSrc);
        setBannerProperties(_adProperties);
      });
    });
  }, []);

  return (
    <>
      {bannerProperties && (
        <a href={bannerProperties.linkUrl}>
          <img src={bannerSrc} alt={bannerProperties.name} />
        </a>
      )}
    </>
  );
};

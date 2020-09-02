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
    getAdImageProperties(props.providerName)
      .then((adProperties) => {
        console.log({ adProperties });
        getBannerUrl(adProperties).then((newBannerSrc) => {
          setBannerSrc(newBannerSrc);
          setBannerProperties(adProperties);
        });
      })
      .catch(() => {
        const defaultBannerProperties: BannerProperties = {
          name: 'admob',
          linkUrl: '',
          imageGs: '',
        };
        setBannerProperties(defaultBannerProperties);
      });
  }, [props.providerName]);

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

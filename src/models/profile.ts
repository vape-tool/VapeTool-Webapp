import { history } from 'umi';
import { User } from '@vapetool/types';
import { Coil, ItemName, Link, Liquid, Photo, Post } from '@/types';
import {
  getUserCoils,
  getUserLinks,
  getUserLiquids,
  getUserPhotos,
  getUserPosts,
} from '@/services/userCenter';
import { getUser } from '@/services/user';
import { isProUser } from '@/utils/utils';
import { useState } from 'react';

export interface UserProfile {
  readonly uid: string;
  readonly name: string;
  readonly pro: boolean;
  readonly tags?: {
    key: string;
    label: string;
  }[];
}

export default () => {
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [userPhotos, setUserPhotos] = useState<Photo[] | undefined>();
  const [userPosts, setUserPosts] = useState<Post[] | undefined>();
  const [userLinks, setUserLinks] = useState<Link[] | undefined>();
  const [userCoils, setUserCoils] = useState<Coil[] | undefined>();
  const [userLiquids, setUserLiquids] = useState<Liquid[] | undefined>();

  async function fetchUserProfile(userId: string) {
    setLoadingProfile(true);
    console.log('fetching', userId);
    const user: User | undefined = await getUser(userId);
    setLoadingProfile(false);
    if (!user) {
      history.replace({ pathname: '/404' });
      return;
    }

    const newUser = {
      ...user,
      uid: userId,
    };
    setProfile(newUser);
  }

  async function fetchItems(what: ItemName) {
    const uid = userProfile?.uid;
    if (!uid) {
      return;
    }

    let items;
    switch (what as ItemName) {
      case ItemName.PHOTO:
        items = await getUserPhotos(uid);
        setUserPhotos(Array.isArray(items) ? items : []);
        break;
      case ItemName.POST:
        items = await getUserPosts(uid);
        setUserPosts(Array.isArray(items) ? items : []);
        break;
      case ItemName.LINK:
        items = await getUserLinks(uid);
        setUserLinks(Array.isArray(items) ? items : []);
        break;
      case ItemName.COIL:
        items = await getUserCoils(uid);
        setUserCoils(Array.isArray(items) ? items : []);
        break;
      case ItemName.LIQUID:
        items = await getUserLiquids(uid);
        setUserLiquids(Array.isArray(items) ? items : []);
        break;
      default:
        throw new Error(`Illegal type ${what}`);
    }
  }

  function setProfile(user: User) {
    const tags = [];
    const isPro = isProUser(user.subscription);
    if (isPro) {
      tags.push({ key: 'pro', label: 'Pro' });
    }

    setUserProfile({
      uid: user.uid,
      name: user.display_name,
      pro: isPro,
      tags,
    });
  }
  return {
    loadingProfile,
    fetchUserProfile,
    fetchItems,
    userProfile,
    userPhotos,
    userPosts,
    userLinks,
    userCoils,
    userLiquids,
  };
};

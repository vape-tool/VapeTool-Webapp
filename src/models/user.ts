import { User as FirebaseUser } from 'firebase/app';
import { logoutFirebase } from '@/services/user';
import { auth } from '@/utils/firebase';
import { useState, useEffect } from 'react';
import { history } from 'umi';

export default function useUserModel() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | undefined>(undefined);

  const logout = async () => {
    await logoutFirebase();
    history.replace('/login');
  };

  useEffect(() => {
    return auth.onAuthStateChanged((_firebaseUser: FirebaseUser | null) => {
      if (!_firebaseUser) {
        setFirebaseUser(undefined);
      } else {
        setFirebaseUser(_firebaseUser);
      }
    });
  }, []);

  return {
    firebaseUser,
    logout,
  };
}

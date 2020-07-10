import { User as FirebaseUser } from 'firebase/app';
import { logoutFirebase } from '@/services/user';
import { auth } from '@/utils/firebase';
import { redirectReplace } from '@/models/global';
import { useState, useEffect } from 'react';

export default function useUserModel() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | undefined>(undefined);

  const logout = async () => {
    await logoutFirebase();
    redirectReplace('/login');
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

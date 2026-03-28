import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'lifetime';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            name: currentUser.displayName || 'User',
            email: currentUser.email || '',
            plan: 'free',
            created_at: new Date().toISOString()
          };
          await setDoc(userRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

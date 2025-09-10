'use client';

import type { User } from 'firebase/auth';
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { db as firestoreDb, auth as firebaseAuth } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import type { loginSchema } from '@/app/login/page';
import { signupSchema } from '@/app/signup/page';

type UserProfile = {
  email: string;
  role: 'user' | 'admin';
  bookmarks?: string[];
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (values: z.infer<typeof signupSchema>) => Promise<void>;
  login: (values: z.infer<typeof loginSchema>) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged only runs on the client.
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(firestoreDb, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                setUserProfile(doc.data() as UserProfile);
            }
             setLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signup = async (values: z.infer<typeof signupSchema>) => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password);
    const user = userCredential.user;
    const userProfileData: UserProfile = {
      email: user.email!,
      role: 'user',
      bookmarks: [],
    };
    await setDoc(doc(firestoreDb, 'users', user.uid), userProfileData);
    setUserProfile(userProfileData);
    router.push('/dashboard');
  };

  const login = async (values: z.infer<typeof loginSchema>) => {
    await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
    router.push('/dashboard');
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    router.push('/login');
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

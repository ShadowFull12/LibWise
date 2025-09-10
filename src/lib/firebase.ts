
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { clientConfig } from './firebase-client-config';

// This function ensures that Firebase is initialized only once.
function getFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(clientConfig);
  }
  return getApp();
}

// Export functions to get the services.
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

// For convenience, you can still export the initialized services for client-side use,
// but they should only be imported in 'use client' components.
export const app = getFirebaseApp();
export const auth = getFirebaseAuth();
export const db = getFirebaseDb();

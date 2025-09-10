// This file is intended for client-side use only.
// It contains the public Firebase configuration.

import { type FirebaseOptions } from "firebase/app";

// The following configuration is for your Firebase project.
export const clientConfig: FirebaseOptions = {
  apiKey: "AIzaSyAD4nGPyCI41aRCCPIIEIWsr3myk9dhgIs",
  authDomain: "libwise-identity.firebaseapp.com",
  projectId: "libwise-identity",
  storageBucket: "libwise-identity.appspot.com",
  messagingSenderId: "645152290608",
  appId: "1:645152290608:web:f02fcc703c41144e5cfaf5",
};

// Public API key for Filestack for file handling.
export const NEXT_PUBLIC_FILESTACK_API_KEY =
  process.env.NEXT_PUBLIC_FILESTACK_API_KEY || "AHUphs286T1aga9GqiSkZz";

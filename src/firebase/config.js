import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3ELOtnOI7vA1GspU8qqq8r3DsBnFROsk",
  authDomain: "projectmark-1c794.firebaseapp.com",
  projectId: "projectmark-1c794",
  storageBucket: "projectmark-1c794.firebasestorage.app",
  messagingSenderId: "80818680137",
  appId: "1:80818680137:web:2cf07364f5d9a948942a98",
  measurementId: "G-Z77ZX19XDE"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const APP_ID = 'marco-tracker';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDelDUqX4aqBwluf227aNJr6SJCLZaIJ-Y",
  authDomain: "saral-app-efb65.firebaseapp.com",
  projectId: "saral-app-efb65",
  storageBucket: "saral-app-efb65.firebasestorage.app",
  messagingSenderId: "262036664376",
  appId: "1:262036664376:android:e2939f4ad399cf65faf6cd"
};

// Initialize Firebase only once
let app: any;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

export { app, auth };

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getAuth,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyB2i02IzkECsvcsFuOME_4d3VqerXSLUnI',
    authDomain: '',
    projectId: 'automated-expense-tracke-1591f',
    storageBucket: 'automated-expense-tracke-1591f.firebasestorage.app',
    messagingSenderId: '890345329881',
    appId: '1:890345329881:android:20c724d03e8ee1f6959ac8',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;

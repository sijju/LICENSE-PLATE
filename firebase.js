
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBtiqn5yOtwa9erTAmoWKdB4Fwf9dDffgI",
  authDomain: "mproject-auth.firebaseapp.com",
  projectId: "mproject-auth",
  storageBucket: "mproject-auth.appspot.com",
  messagingSenderId: "119839820636",
  appId: "1:119839820636:web:f46ecea1755a3f91e10f99"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app)

export {app,auth,storage}

// Firebase
import firebase from 'firebase';

// Secrets
import { apiKey } from './secrets';

firebase.initializeApp({
  apiKey,
  authDomain: "lesilencedesjustes-df85a.firebaseapp.com",
  databaseURL: "https://lesilencedesjustes-df85a.firebaseio.com",
  storageBucket: "lesilencedesjustes-df85a.appspot.com",
  messagingSenderId: "1073646660984",
});

export default firebase;
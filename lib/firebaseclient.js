import firebase from 'firebase/app';
import 'firebase/auth';
//import 'import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import cookie from 'js-cookie';
//var firebaseui = require('firebaseui');
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDstpC-1cW7V4e7gTbtk12FOyDR-tdxObU",
    authDomain: "donapp-d2378.firebaseapp.com",
    databaseURL: "https://donapp-d2378.firebaseio.com",
    projectId: "donapp-d2378",
    storageBucket: "donapp-d2378.appspot.com",
    messagingSenderId: "749688238426",
    appId: "1:749688238426:web:f19a238c43725fd181c363",
    measurementId: "G-DFW51L0W1X",
  });
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
}
var app = firebase.app();
var auth = firebase.auth();
var db = firebase.firestore();
var now = firebase.firestore.Timestamp.now();
var storage = firebase.storage();
//var ui = new firebaseui.auth.AuthUI(firebase.auth());

console.log(app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(');

import {
    useState, 
} from 'react';

import { useAuth } from '../hooks/useAuth';

const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = async () => {
  await auth.signInWithPopup(googleProvider).then(async (res) => {
    //const [user, setUser] = useState(null);
    console.log(res.user)
    //setUser(res.user);
    console.log('-----signin---------current user id: ' + auth.currentUser.uid + ' --------------')
    const doc = await firebase.firestore().collection('users').doc(auth.currentUser.uid).get()
    console.log('-----signin---------current user data: ' + doc.data().name + ' --------------')
    const docn = await firebase.firestore().collection('users').doc('n5FofOGmAHc2nYTv4Kbit3SysRo2').get()
    console.log('-----signin---------current n5Fof... data: ' + docn.data().name + ' --------------')
    useAuth.user = res.user;
    setUser(res.user);
    app = firebase.app();
    auth = firebase.auth();
    db = firebase.firestore();
    now = firebase.firestore.Timestamp.now();
    storage = firebase.storage();
  }).catch((error) => {
    console.log(error.message)
  })
}

export { auth, db, now, storage, firebase };


const onAuthStateChange = () => {
  
  return firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      cookie.set(tokenName, token, { expires: 14 });
    } else {
      cookie.remove(tokenName);
    }
  });
};

const facebookProvider = new firebase.auth.FacebookAuthProvider()
export const signInWithFacebook = () => {
    auth.signInWithPopup(facebookProvider).then((res) => {
      console.log(res.user)
      setUser(res.user);
    }).catch((error) => {
      console.log(error.message)
    }) 
}
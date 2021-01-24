import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

function firebaseService() {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  });
}

const createUser = async (values) => {
  const userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(values.email, values.password);

  return db.collection('users').doc(userCredential.user.uid).set({
    email: values.email,
    name: values.name,
  });
};

export default { firebase, login, createUser };

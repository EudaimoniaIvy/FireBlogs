import firebase from 'firebase/app'
import  "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyBBPHloxr-r-enlsCbkFPm4QRlEgU_0DA0",
    authDomain: "fireblogsnn.firebaseapp.com",
    projectId: "fireblogsnn",
    storageBucket: "fireblogsnn.appspot.com",
    messagingSenderId: "720408681661",
    appId: "1:720408681661:web:3a8c857c2780ac2ecdabd4"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {timestamp}
export default firebaseApp.firestore()
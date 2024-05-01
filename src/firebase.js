import { initializeApp } from "firebase/app";
import "firebase/compat/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBzc-gjxoy4C8bbauWU-TlLymxcOdExjNU",
  authDomain: "financebudgettransfer.firebaseapp.com",
  projectId: "financebudgettransfer",
  storageBucket: "financebudgettransfer.appspot.com",
  messagingSenderId: "536356517730",
  appId: "1:536356517730:web:f2ee80899632cd79685e3b",
};

const firebase = initializeApp(firebaseConfig);
export default firebase;

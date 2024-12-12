// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGEING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDvpsSIh-NkyrpvErXRSwm8bASH4XII5T0",
  authDomain: "ai-recipe-generator-baebf.firebaseapp.com",
  projectId: "ai-recipe-generator-baebf",
  storageBucket: "ai-recipe-generator-baebf.firebasestorage.app",
  messagingSenderId: "298276142504",
  appId: "1:298276142504:web:0ae38c787fe5d5a99bf19d",
  measurementId: "G-8D5SDDPKQD",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const intializeFirebase = () => {
  initializeApp(firebaseConfig);
};
const analytics = getAnalytics(firebaseApp);

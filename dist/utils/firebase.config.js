"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intializeFirebase = exports.firebaseApp = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
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
exports.firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
const intializeFirebase = () => {
    (0, app_1.initializeApp)(firebaseConfig);
};
exports.intializeFirebase = intializeFirebase;
const analytics = (0, analytics_1.getAnalytics)(exports.firebaseApp);

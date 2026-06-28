// firebase-config.js

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getMessaging }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

import {
    getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvzI0JvNuR5bNaHDT7_oP-5-n72ve4fuU",
  authDomain: "vuthanhcong-e7ef8.firebaseapp.com",
  projectId: "vuthanhcong-e7ef8",
  storageBucket: "vuthanhcong-e7ef8.firebasestorage.app",
  messagingSenderId: "206106498648",
  appId: "1:206106498648:web:90b3edaaa015bc60439c2d"
};


const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyAZ9ZS8U5h8QWFiRD0yNGtT-ScfZFlg1n4",
//   authDomain: "smart-greenhouse-system-94981.firebaseapp.com",
//   databaseURL:
//     "https://smart-greenhouse-system-94981-default-rtdb.firebaseio.com",
//   projectId: "smart-greenhouse-system-94981",
//   storageBucket: "smart-greenhouse-system-94981.firebasestorage.app",
//   messagingSenderId: "62775788655",
//   appId: "1:62775788655:web:7e21952da8200efa17b99a",
//   measurementId: "G-XC1FLY3HGZ",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCwBriGgolF2ezrNTGaqgKFMrZY2efxIS4",
  authDomain: "green-house-iot-ab0c9.firebaseapp.com",
  databaseURL: "https://green-house-iot-ab0c9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "green-house-iot-ab0c9",
  storageBucket: "green-house-iot-ab0c9.firebasestorage.app",
  messagingSenderId: "1051399417408",
  appId: "1:1051399417408:web:fe3db669dd390ca8db39a5",
  measurementId: "G-TTQ9GTED9S"
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

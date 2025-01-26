// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// // import reportWebVitals from './reportWebVitals';
// import '@fontsource/poppins/300.css';
// import '@fontsource/poppins/400.css';
// import '@fontsource/poppins/500.css';
// import '@fontsource/poppins/700.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeApp } from 'firebase/app';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

const firebaseConfig = {
  apiKey: "AIzaSyBhB8lir8lahLONcWPW9fnyd611DlDay7w",
  authDomain: "readme-bc6b0.firebaseapp.com",
  projectId: "readme-bc6b0",
  storageBucket: "readme-bc6b0.firebasestorage.app",
  messagingSenderId: "326539962477",
  appId: "1:326539962477:web:8790212c3a9a80affd7764",
  measurementId: "G-99F0CLKCRH"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


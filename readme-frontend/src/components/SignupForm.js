
// import React, { useState } from 'react';
// import axios from 'axios';
// import { getAuth, signInAnonymously } from 'firebase/auth';  // Import modular auth functions
// import { initializeApp } from 'firebase/app';  // Import the initializeApp function


// const firebaseConfig = {
//     apiKey: "AIzaSyBhB8lir8lahLONcWPW9fnyd611DlDay7w",
//     authDomain: "readme-bc6b0.firebaseapp.com",
//     projectId: "readme-bc6b0",
//     storageBucket: "readme-bc6b0.firebasestorage.app",
//     messagingSenderId: "326539962477",
//     appId: "1:326539962477:web:8790212c3a9a80affd7764",
//     measurementId: "G-99F0CLKCRH"
//   };

//   const app = initializeApp(firebaseConfig);
// function SignupForm({ onTrialActivate }) {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [deviceId, setDeviceId] = useState(''); // For storing the unique device ID
//   const [firebaseToken, setFirebaseToken] = useState('');


//   // Function to get device ID using FingerprintJS
//   const getDeviceId = async () => {
//     const fp = await import('@fingerprintjs/fingerprintjs');
//     const fpInstance = await fp.load();
//     const result = await fpInstance.get();
//     return result.visitorId;
//   };

//   // Handle user sign-up
//   // Handle user sign-up and Firebase authentication
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Sign in anonymously using Firebase Authentication
//       const auth = getAuth(app); // Get auth instance from Firebase app
//       const userCredential = await signInAnonymously(auth);  // Sign in anonymously
//       const userToken = await userCredential.user.getIdToken();  // Get Firebase token

//       const deviceId = await getDeviceId();
//       setDeviceId(deviceId);  // Store device ID

//       const response = await axios.post('http://localhost:3000/api/signup', {
//         email,
//         firebaseToken: userToken,  // Send Firebase token to backend
//         deviceId,
//       });

//       setMessage(response.data.message);
//       onTrialActivate(deviceId);  // Notify parent component about trial activation
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Error during sign-up');
//     }
//   };

//   return (
//     <div>
//       <h2>Sign Up for Free Trial</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           required
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//       <div>{message}</div>
//     </div>
//   );
// }

// export default SignupForm;
import React, { useState } from 'react';
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import axios from 'axios';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';
import { Google } from '@mui/icons-material';
import { motion } from 'framer-motion';

const firebaseConfig = {
  apiKey: "AIzaSyBhB8lir8lahLONcWPW9fnyd611DlDay7w",
  authDomain: "readme-bc6b0.firebaseapp.com",
  projectId: "readme-bc6b0",
  storageBucket: "readme-bc6b0.firebasestorage.app",
  messagingSenderId: "326539962477",
  appId: "1:326539962477:web:8790212c3a9a80affd7764",
  measurementId: "G-99F0CLKCRH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function SignupForm({ onTrialActivate }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceId = async () => {
    const fp = await import('@fingerprintjs/fingerprintjs');
    const fpInstance = await fp.load();
    const result = await fpInstance.get();
    return result.visitorId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInAnonymously(auth);
      const userToken = await userCredential.user.getIdToken();
      const deviceId = await getDeviceId();

       // Store the device ID in localStorage
       localStorage.setItem('deviceId', deviceId); // Store the deviceId

       

      const response = await axios.post('http://localhost:3000/api/signup', {
        email,
        firebaseToken: userToken,
        deviceId,
      });

      setMessage(response.data.message);
      // Calling the function passed as a prop from the parent component
      if (onTrialActivate) {
        onTrialActivate(deviceId);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error during sign-up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userToken = await result.user.getIdToken();
      const deviceId = await getDeviceId();

      // Store the device ID in localStorage
      localStorage.setItem('deviceId', deviceId); // Store the deviceId

      // Log data being sent
    console.log({
      email: result.user.email,
      firebaseToken: userToken,
      deviceId,
    });

      const response = await axios.post('http://localhost:3000/api/signup', {
        email: result.user.email,
        firebaseToken: userToken,
        deviceId,
      });

      setMessage(response.data.message);
      onTrialActivate(deviceId);
    } catch (error) {
      setMessage(error.message || 'Error during Google sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Sign Up for Free Trial
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>
        <Button
          onClick={handleGoogleSignIn}
          variant="outlined"
          startIcon={<Google />}
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          Sign up with Google
        </Button>
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </motion.div>
  );
}

export default SignupForm;



// import React, { useState } from 'react';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import ReadmeGenerator from './components/ReadmeGenerator';
// import SignupForm from './components/SignupForm';  // Import SignupForm component



// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#6200EA',
//     },
//     secondary: {
//       main: '#00C853',
//     },
//     background: {
//       default: '#f0f4f8',
//     },
//   },
//   typography: {
//     fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 700,
//     },
//     h2: {
//       fontWeight: 600,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: 'none',
//           fontWeight: 600,
//         },
//       },
//     },
//   },
// });

// function App() {
//   const [readmeContent, setReadmeContent] = useState('');
//   const [projectName, setProjectName] = useState('');
//   const [isTrialActive, setIsTrialActive] = useState(false);  // Track trial status
//   const [deviceId, setDeviceId] = useState('');

//   const handleTrialActivation = (deviceId) => {
//     setDeviceId(deviceId);  // Store the device ID to manage trial
//     setIsTrialActive(true);  // Set trial as active
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box
//         sx={{
//           minHeight: '100vh',
//           background: 'linear-gradient(120deg, #f0f4f8 0%, #d7e3fc 100%)',
//           py: 4,
//         }}
//       >
//         <Container maxWidth="md">
//           <Typography variant="h2" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
//             AI-Powered README Generator
//           </Typography>
//           {/* Conditionally render either the SignupForm or ReadmeGenerator */}
//           {!isTrialActive ? (
//             <SignupForm onTrialActivate={handleTrialActivation} />
//           ) : (
//             <ReadmeGenerator readmeContent={readmeContent} projectName={projectName} />
//           )}
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import MainPage from './components/MainPage';
// import ReadmeGenerator from './components/ReadmeGenerator';
// import SignupForm from './components/SignupForm';
// import Login from './components/Login';
// import Pricing from './components/Pricing';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#6200EA',
//     },
//     secondary: {
//       main: '#00C853',
//     },
//     background: {
//       default: '#f0f4f8',
//     },
//   },
//   typography: {
//     fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 700,
//     },
//     h2: {
//       fontWeight: 600,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: 'none',
//           fontWeight: 600,
//         },
//       },
//     },
//   },
// });

// function App() {
//   const [isTrialActive, setIsTrialActive] = useState(false);
//   const [deviceId, setDeviceId] = useState('');

//   const handleTrialActivation = (deviceId) => {
//     setDeviceId(deviceId);
//     setIsTrialActive(true);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <Navbar isTrialActive={isTrialActive} />
//         <Routes>
//           <Route path="/" element={<MainPage onTrialActivate={handleTrialActivation} />} />
//           <Route 
//             path="/generator" 
//             element={
//               isTrialActive ? (
//                 <ReadmeGenerator />
//               ) : (
//                 <SignupForm onTrialActivate={handleTrialActivation} />
//               )
//             } 
//           />
//           <Route path="/pricing" element={<Pricing />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import MainPage from './components/MainPage';
import ReadmeGenerator from './components/ReadmeGenerator';
import SignupForm from './components/SignupForm';
import Login from './components/Login';
import Pricing from './components/Pricing';
import PaymentGateway from './components/PaymentGateway';
import SubscriptionStatus from './components/SubscriptionStatus ';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EA',
    },
    secondary: {
      main: '#00C853',
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState('');

   // Function to handle trial activation
   const handleTrialActivate = (deviceId) => {
    console.log('Trial activated for device:', deviceId);
    setDeviceId(deviceId);  // Store the deviceId or perform any action here
  };



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route 
            path="/generator" 
            element={
              user ? <ReadmeGenerator /> : <Navigate to="/signup" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <SubscriptionStatus /> : <Navigate to="/signup" />
            } 
          />
          <Route path="/pricing" element={<Pricing user={user} />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<SignupForm onTrialActivate={handleTrialActivate} />} />
          <Route 
            path="/payment" 
            element={
              user ? <PaymentGateway /> : <Navigate to="/signup" />
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


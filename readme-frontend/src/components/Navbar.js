// import React from 'react';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';

// function Navbar({ isTrialActive }) {
//   return (
//     <AppBar position="static" color="transparent" elevation={0}>
//       <Toolbar>
//         <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
//           README Generator
//         </Typography>
//         <Box>
//           <Button color="inherit" component={RouterLink} to="/pricing">
//             Pricing
//           </Button>
//           <Button color="inherit" component={RouterLink} to="/login">
//             Login
//           </Button>
//           {isTrialActive && (
//             <Button color="primary" variant="contained" component={RouterLink} to="/generator">
//               Go to Generator
//             </Button>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default Navbar;

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Navbar({ user }) {
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          README Generator
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/pricing">
            Pricing
          </Button>
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/generator">
                Generator
              </Button>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button> */}
              <Button color="inherit" component={RouterLink} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;


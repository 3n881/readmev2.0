// import React, { useState } from 'react';
// import { Paper, Tabs, Tab, Box } from '@mui/material';
// import ReadmeForm from './ReadmeForm';
// import ReadmePreview from './ReadmePreview';

// function ReadmeGenerator() {
//   const [readmeContent, setReadmeContent] = useState('');
//   const [projectName, setProjectName] = useState('');
//   const [tabValue, setTabValue] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
//       <Tabs
//         value={tabValue}
//         onChange={handleTabChange}
//         indicatorColor="primary"
//         textColor="primary"
//         variant="fullWidth"
//         sx={{
//           '& .MuiTab-root': {
//             fontWeight: 600,
//             fontSize: '1rem',
//           },
//         }}
//       >
//         <Tab label="Create README" />
//         <Tab label="Preview" />
//       </Tabs>
//       <Box sx={{ p: 3 }}>
//         {tabValue === 0 && (
//           <ReadmeForm
//             setReadmeContent={setReadmeContent}
//             setProjectName={setProjectName}
//           />
//         )}
//         {tabValue === 1 && (
//           <ReadmePreview
//             readmeContent={readmeContent}
//             projectName={projectName}
//           />
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default ReadmeGenerator;

import React, { useState, useEffect } from 'react';
import { Paper, Tabs, Tab, Box, Typography, CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import ReadmeForm from './ReadmeForm';
import ReadmePreview from './ReadmePreview';

function ReadmeGenerator() {
  const [readmeContent, setReadmeContent] = useState('');
  const [projectName, setProjectName] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();

         // Retrieve the deviceId from localStorage
      const deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        throw new Error('Device ID not found');
      }

        const response = await axios.get(`http://localhost:3000/api/check-subscription?deviceId=${deviceId}`);
        // ,
        // {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   },
        // params: {
        //   deviceId, // Pass the deviceId to the backend
        // },
        // });

        // if (!response.data.isSubscribed) {
        //   throw new Error('User is not subscribed');
        // }
        if (response.data.error) {
          throw new Error(response.data.error);
        }
    
        if (response.data.message === 'Trial has expired. Please subscribe to continue.') {
          // Inform the user that their trial has expired
          alert('Your trial has expired. Please subscribe to continue.');
        } else if (response.data.message === 'Trial is active.') {
          // Inform the user that they are still in trial
          alert('Your trial is still active.');
        } else {
          // User is paid
          alert('You have an active subscription.');
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': {
            fontWeight: 600,
            fontSize: '1rem',
          },
        }}
      >
        <Tab label="Create README" />
        <Tab label="Preview" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {tabValue === 0 && (
          <ReadmeForm
            setReadmeContent={setReadmeContent}
            setProjectName={setProjectName}
          />
        )}
        {tabValue === 1 && (
          <ReadmePreview
            readmeContent={readmeContent}
            projectName={projectName}
          />
        )}
      </Box>
    </Paper>
  );
}

export default ReadmeGenerator;


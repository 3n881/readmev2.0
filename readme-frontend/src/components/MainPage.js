// import React from 'react';
// import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Description, Speed, EmojiObjects, Code } from '@mui/icons-material';

// function MainPage({ onTrialActivate }) {
//   const navigate = useNavigate();

//   const handleFreeTrial = () => {
//     const deviceId = Math.random().toString(36).substring(7);
//     onTrialActivate(deviceId);
//     navigate('/generator');
//   };

//   const benefits = [
//     { title: 'Professional READMEs', description: 'Create stunning project documentation', icon: <Description /> },
//     { title: 'Time-Saving', description: 'Generate READMEs in minutes, not hours', icon: <Speed /> },
//     { title: 'AI-Powered', description: 'Leverage cutting-edge AI technology', icon: <EmojiObjects /> },
//     { title: 'Customizable', description: 'Tailor READMEs to your project needs', icon: <Code /> },
//   ];

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg, #f0f4f8 0%, #d7e3fc 100%)',
//         py: 8,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={4} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Typography variant="h2" component="h1" gutterBottom color="primary">
//                 AI-Powered README Generator
//               </Typography>
//               <Typography variant="h5" paragraph>
//                 Create professional README files for your projects in minutes.
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 size="large"
//                 onClick={handleFreeTrial}
//                 sx={{ mt: 2 }}
//               >
//                 Start Free Trial
//               </Button>
//             </motion.div>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Box
//                 component="img"
//                 src="/placeholder.svg"
//                 alt="README Generator"
//                 sx={{
//                   width: '100%',
//                   maxWidth: 400,
//                   height: 'auto',
//                   display: 'block',
//                   margin: '0 auto',
//                 }}
//               />
//             </motion.div>
//           </Grid>
//         </Grid>

//         <Typography variant="h3" align="center" sx={{ mt: 8, mb: 4 }}>
//           Benefits
//         </Typography>
//         <Grid container spacing={4}>
//           {benefits.map((benefit, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//                       {benefit.icon}
//                     </Box>
//                     <Typography variant="h6" align="center" gutterBottom>
//                       {benefit.title}
//                     </Typography>
//                     <Typography variant="body2" align="center">
//                       {benefit.description}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>

//         <Box sx={{ mt: 8, textAlign: 'center' }}>
//           <Typography variant="h4" gutterBottom>
//             How It Works
//           </Typography>
//           <Typography variant="body1" paragraph>
//             Our AI-powered README generator uses state-of-the-art natural language processing to create
//             comprehensive and professional project documentation. Simply input your project details,
//             and let our advanced algorithms do the rest.
//           </Typography>
//           <Button variant="outlined" color="primary" size="large">
//             Learn More
//           </Button>
//         </Box>
//       </Container>
//     </Box>
//   );
// }

// export default MainPage;

import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Description, Speed, EmojiObjects, Code } from '@mui/icons-material';

function MainPage() {
  const navigate = useNavigate();

  const handleFreeTrial = () => {
    navigate('/pricing');
  };

  const benefits = [
    { title: 'Professional READMEs', description: 'Create stunning project documentation', icon: <Description /> },
    { title: 'Time-Saving', description: 'Generate READMEs in minutes, not hours', icon: <Speed /> },
    { title: 'AI-Powered', description: 'Leverage cutting-edge AI technology', icon: <EmojiObjects /> },
    { title: 'Customizable', description: 'Tailor READMEs to your project needs', icon: <Code /> },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f0f4f8 0%, #d7e3fc 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h2" component="h1" gutterBottom color="primary">
                AI-Powered README Generator
              </Typography>
              <Typography variant="h5" paragraph>
                Create professional README files for your projects in minutes.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleFreeTrial}
                sx={{ mt: 2 }}
              >
                Start Free Trial
              </Button>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                component="img"
                src="/placeholder.svg"
                alt="README Generator"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        <Typography variant="h3" align="center" sx={{ mt: 8, mb: 4 }}>
          Benefits
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="body1" paragraph>
            Our AI-powered README generator uses state-of-the-art natural language processing to create
            comprehensive and professional project documentation. Simply input your project details,
            and let our advanced algorithms do the rest.
          </Typography>
          <Button variant="outlined" color="primary" size="large">
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default MainPage;


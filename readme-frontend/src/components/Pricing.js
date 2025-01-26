// import React from 'react';
// import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
// import { motion } from 'framer-motion';

// const plans = [
//   {
//     title: 'Monthly',
//     price: '$9.99',
//     period: 'per month',
//     features: ['Unlimited README generation', '24/7 support', 'Access to all templates'],
//   },
//   {
//     title: 'Half Yearly',
//     price: '$49.99',
//     period: 'per 6 months',
//     features: ['All Monthly features', '10% discount', 'Priority support'],
//   },
//   {
//     title: 'Yearly',
//     price: '$89.99',
//     period: 'per year',
//     features: ['All Half Yearly features', '25% discount', 'Custom branding'],
//   },
// ];

// function Pricing() {
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg, #f0f4f8 0%, #d7e3fc 100%)',
//         py: 8,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
//           Choose Your Plan
//         </Typography>
//         <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
//           {plans.map((plan, index) => (
//             <Grid item key={plan.title} xs={12} sm={6} md={4}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <Card raised>
//                   <CardContent>
//                     <Typography variant="h5" component="h2" gutterBottom align="center">
//                       {plan.title}
//                     </Typography>
//                     <Typography variant="h3" component="p" align="center" color="primary" gutterBottom>
//                       {plan.price}
//                     </Typography>
//                     <Typography variant="subtitle1" align="center" gutterBottom>
//                       {plan.period}
//                     </Typography>
//                     <Box sx={{ mt: 2 }}>
//                       {plan.features.map((feature, index) => (
//                         <Typography key={index} variant="body1" gutterBottom>
//                           • {feature}
//                         </Typography>
//                       ))}
//                     </Box>
//                   </CardContent>
//                   <CardActions>
//                     <Button fullWidth variant="contained" color="primary">
//                       Choose Plan
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// export default Pricing;

import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    title: 'Monthly',
    price: '₹999',
    period: 'per month',
    features: ['Unlimited README generation', '24/7 support', 'Access to all templates'],
    paymentPageUrl: 'https://rzp.io/rzp/wfdf1fbP' // Link to the Razorpay payment page for Monthly plan
  },
  {
    title: 'Half Yearly',
    price: '₹4999',
    period: 'per 6 months',
    features: ['All Monthly features', '10% discount', 'Priority support'],
    paymentPageUrl: 'https://rzp.io/rzp/6l9EiGR' // Link to the Razorpay payment page for Monthly plan

  },
  {
    title: 'Yearly',
    price: '₹8999',
    period: 'per year',
    features: ['All Half Yearly features', '25% discount', 'Custom branding'],
    paymentPageUrl: 'https://rzp.io/rzp/tzIyiWBZ' // Link to the Razorpay payment page for Monthly plan

  },
];

function Pricing({ user }) {
  const navigate = useNavigate();

  const handleChoosePlan = (plan) => {
    if (user) {
        // Redirect user to the Razorpay payment page for the selected plan
        window.location.href = plan.paymentPageUrl;
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f0f4f8 0%, #d7e3fc 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
          Choose Your Plan
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {plans.map((plan, index) => (
            <Grid item key={plan.title} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card raised>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom align="center">
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" component="p" align="center" color="primary" gutterBottom>
                      {plan.price}
                    </Typography>
                    <Typography variant="subtitle1" align="center" gutterBottom>
                      {plan.period}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {plan.features.map((feature, index) => (
                        <Typography key={index} variant="body1" gutterBottom>
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleChoosePlan(plan)}
                    >
                      Choose Plan
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Pricing;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// // Define the function to get the unique device ID using FingerprintJS
// const getDeviceId = async () => {
//     const fp = await import('@fingerprintjs/fingerprintjs');
//     const fpInstance = await fp.load();
//     const result = await fpInstance.get();
//     return result.visitorId;
//   };

function PaymentGateway() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};

  useEffect(() => {
    const loadRazorpay = async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        setError('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const deviceId = localStorage.getItem('deviceId');
      console.log('Sending deviceId:', deviceId);
      // const token = await user.getIdToken();

      // Confirm that the plan object is correctly populated
    console.log('Plan details:', plan);
    console.log('Plan price:', plan.price); // Check if plan price is available

       // Extract numeric value from the price string (e.g., ₹999 should become 99900)
    const amountInPaise = parseInt(plan.price.replace(/[^\d]/g, '')) * 100;

    // Check if the amount is valid
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      throw new Error('Invalid price');
    }
      // const deviceId = await getDeviceId();  // Get the deviceId using FingerprintJS
      const response = await axios.post('http://localhost:3000/api/payment', {
        deviceId,   
        amount: amountInPaise, // Correctly passed as integer value (in paise)
    });                   // Send deviceId to backend
        // plan: plan.title,
        // amount: parseInt(plan.price.replace('₹', '')) * 100, // Convert to paise
      // }, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      const { order } = response.data;
      console.log('Received Razorpay order:', order);


      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: response.data.order.amount,
        currency: "INR",
        order_id: response.data.order.id,
        name: "README Generator",
        description: `${plan.title} Plan`,
        handler: async (response) => {
          try {
            const paymentVerification = await axios.post('http://localhost:3000/api/payment/verify', {
              paymentId: response.razorpay_payment_id,
              orderId: order.id,
              signature: response.razorpay_signature,
            });
            if (paymentVerification.data.success) {
              navigate('/generator');
            }
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user.email,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(error.message || 'Payment initiation failed. Please try again.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Complete Your Payment
        </Typography>
        <Typography variant="h5" gutterBottom>
          {plan.title} Plan - {plan.price}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handlePayment}
          sx={{ mt: 2 }}
        >
          Pay Now
        </Button>
      </Box>
    </Container>
  );
}

export default PaymentGateway;


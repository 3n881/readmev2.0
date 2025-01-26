// SubscriptionStatus.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase'; // Import Firebase configuration

const SubscriptionStatus = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', user.uid); // Assuming 'users' collection and 'uid' as the doc ID
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setSubscriptionData(userDoc.data());
        } else {
          setError('No subscription found');
        }
      } catch (err) {
        setError('Error fetching subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Subscription Status</Typography>
      <Typography>Plan: {subscriptionData.plan}</Typography>
      <Typography>
        Subscription Expiry: {subscriptionData.subscriptionExpiry.toDate().toString()}
      </Typography>
    </Box>
  );
};

export default SubscriptionStatus;

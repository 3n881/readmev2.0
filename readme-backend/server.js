const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const fingerprintjs = require('@fingerprintjs/fingerprintjs');
const admin = require('firebase-admin');
const crypto = require('crypto');
require('dotenv').config();
const cors = require('cors'); // Import cors


const app = express();
const port = 3000;

// Use body-parser to handle JSON requests
app.use(bodyParser.json());

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(require('./readmefirebase.json')), // Your Firebase service account key
  databaseURL: 'https://readme-bc6b0-default-rtdb.firebaseio.com/' // Your Firebase Realtime Database URL
});

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});



// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Fetch API key from environment variables
});

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Webhook secret from Razorpay
const webhookSecret = 'YOUR_WEBHOOK_SECRET'; // Set this securely in environment variables




// Simulating a database
const users = {}; // This is an in-memory database for demo purposes


// Firebase Authentication middleware
const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};


app.post('/api/signup', async (req, res) => {
  const { email, firebaseToken, deviceId } = req.body;

   // Check if the required fields are present
   if (!email || !firebaseToken || !deviceId) {
    return res.status(400).json({ error: 'Required fields: email, firebaseToken, and deviceId are missing' });
  }

  // Verify Firebase token and get the UID of the user
  try {
    // const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const user = await verifyFirebaseToken(firebaseToken);

    const userId = uuidv4();
    const trialStartDate = new Date();
    const trialExpiryDate = new Date(trialStartDate);
    trialExpiryDate.setDate(trialStartDate.getDate() + 7);

    if (users[deviceId]) {
      return res.status(400).json({ error: 'Free trial has already been used on this device.' });
    }

    // Save user data and trial info to memory (or Firebase Firestore)
    users[deviceId] = {
      userId,
      email,
      trialStartDate,
      trialExpiryDate,
      paid: false,
      firebaseUID: user.uid,  // Link Firebase UID to trial data
      deviceId,
    };

    res.status(200).json({ message: 'User created successfully, trial started.' });
  } catch (error) {
    res.status(400).json({ error: 'Error during sign-up: ' + error.message });
  }
});

// Endpoint to check trial status
app.post('/api/check-trial', async (req, res) => {
  // const deviceId = await getDeviceId(req); // Get device fingerprint
  const { deviceId } = req.body; // Receive deviceId from frontend
  const user = users[deviceId];

  if (!user) {
    return res.status(400).json({ error: 'User not found or trial expired.' });
  }

  if (user.paid) {
    return res.status(200).json({ message: 'Access granted as a paid user.' });
  }

  const currentDate = new Date();
  if (currentDate > user.trialExpiryDate) {
    return res.status(403).json({ error: 'Trial has expired. Please subscribe to continue.' });
  }

  res.status(200).json({ message: 'Trial is active.' });
});

// // // Endpoint to handle payment with Razorpay
// app.post('/api/payment', async (req, res) => {
//   const { deviceId, amount } = req.body;
//   console.log('Received deviceId:', deviceId);
//   console.log('Received amount:', amount);
//   // console.log('Received amount:', plan);
//   if (!deviceId || !amount) {
//     return res.status(400).json({ error: 'Device ID and amount are required' });
//   }

//   // const receipt = `receipt_${uuidv4().slice(0, 10)}`;


//   const user = users[deviceId];
//   if (!user) {
//     return res.status(400).json({ error: 'User not found.' });
//   }

//   try {
//     // Create a payment order with Razorpay
//     const order = await razorpay.orders.create({
//       amount: amount, // Amount in the smallest unit (5000 = Rs. 50.00)
//       currency: 'INR',
//       receipt: `receipt#${user.userId}`,
//       // receipt: receipt, // Ensure receipt doesn't exceed 40 characters
//     });

//     // Store payment order ID
//     users[deviceId].paid = true; // Mark the user as paid

//     res.status(200).json({ message: 'Payment successful, user is now paid.', order });
//   } catch (error) {
//     console.error('Payment error:', error);
//     res.status(400).json({ error: 'Payment failed. Please try again.' });
//   }
// });

// // Endpoint to verify payment after completion
// app.post('/api/payment/verify', async (req, res) => {
//   const { paymentId, orderId, signature } = req.body;

//   // Verify the signature sent by Razorpay
//   const crypto = require('crypto');
//   const generatedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(orderId + '|' + paymentId)
//     .digest('hex');

//   if (generatedSignature === signature) {
//     // If signature matches, payment is successful
//     res.status(200).json({ success: true, message: 'Payment successful' });
//   } else {
//     // If signature mismatch
//     res.status(400).json({ success: false, message: 'Payment verification failed' });
//   }
// });

// Endpoint to check user subscription status

// Handle Razorpay webhook
app.post('/api/razorpay-webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Payment details received from Razorpay
  const paymentDetails = JSON.parse(body).payload.payment.entity;
  const deviceId = paymentDetails.notes.deviceId; // Store the deviceId in Razorpay's notes
  const amountPaid = paymentDetails.amount; // Amount in paise (smallest unit)
  const planTitle = paymentDetails.notes.planTitle; // Store plan title (monthly/half-yearly/yearly)


  // Check if the payment was successful
  if (paymentDetails.status === 'captured') {
    // Handle payment completion: Update subscription status in your database

    try {
      // Reference to Firebase Firestore
      const userRef = admin.firestore().collection('users').doc(deviceId);

      // Fetch the user details
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();

        // Update subscription details in Firestore
        const subscriptionExpiry = new Date();

        // Set subscription expiry based on the plan
        if (planTitle === 'Monthly') {
          subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1);
        } else if (planTitle === 'Half Yearly') {
          subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 6);
        } else if (planTitle === 'Yearly') {
          subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1);
        }

        await userRef.update({
          paid: true,
          subscriptionExpiry: subscriptionExpiry,
          plan: planTitle,
        });

        res.status(200).json({ message: 'Payment verified and subscription activated' });
      } else {
        res.status(400).json({ error: 'User not found for the provided device ID' });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  } else {
    res.status(400).json({ error: 'Payment not successful' });
  }
});

app.get('/api/check-subscription', async (req, res) => {
  const { deviceId } = req.query;  // Assume deviceId is passed as a query parameter

  console.log('Users Data:', users);  // Log the users data to check the deviceId status


  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const user = users[deviceId];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // if (user.paid) {
  //   return res.status(200).json({ message: 'User has an active subscription' });
  // } else {
  //   return res.status(403).json({ error: 'User does not have an active subscription' });
  // }
  const currentDate = new Date();
  if (user.paid) {
    return res.status(200).json({ message: 'User has an active subscription' });
  }

  // Check if trial has expired
  if (currentDate > new Date(user.trialExpiryDate)) {
    return res.status(403).json({ error: 'Trial has expired. Please subscribe to continue.' });
  }

  return res.status(200).json({ message: 'Trial is active.' });
});



/**
 * @route POST /api/generate-readme
 * @desc Generate a structured README file for a project
 * @param {string} projectName - The name of the project
 * @param {string} description - A brief description of the project
 * @param {string} technologies - Technologies used in the project
 * @param {string} liveDemoLink - Optional live demo link
 * @param {string} youtubeLink - Optional YouTube link
 * @param {string} icons - Optional icons for the README sections
 * @returns {string} A formatted README file
 */
app.post('/api/generate-readme', async (req, res) => {
  const { projectName, description, technologies,liveDemoLink,
    youtubeLink,
    icons, } = req.body;

  // Validate input
  if (!projectName || !description || !technologies) {
    return res.status(400).json({ error: 'Required fields: projectName, description, and technologies are missing' });
  }

  // Prepare the prompt for OpenAI
  const prompt = `
    Create a well-structured README.md file for the project '${projectName}' using the following details:

    **Rules:**
    - Always start with '# Project Title' and include the project name.
    - Dont start it with \`\`\`markdown for the starting point.Always start with '# Project Title' and include the project name
    - Include a '## Project Description' section with the provided description.
    - Add a '## Table of Contents' section with links to other sections.
    - Use \`\`\`bash blocks for any command line instructions (e.g., \`\`\`bash\\n$ npm start\\n\`\`\`).
    - Include sections for Installation, Usage, Features, Contributing Guidelines, License, Badges, Screenshots, and FAQs.
    - Ensure proper Markdown formatting and consistent spacing between sections.
    - Provide placeholders for screenshots, badges, and FAQs if content is not provided.


    **Project Description:** ${description}
    **Technologies Used:** ${technologies}
    **Live Demo Link:** ${liveDemoLink || 'None provided'}
    **YouTube Demo Link:** ${youtubeLink || 'None provided'}
    **Icons for Sections:** ${icons || 'None provided'}


    The README should include:
    - **# Project Title**: '${projectName}'
    - **## Project Description**: Provide a brief description of the project.
    - **## Table of Contents**: A list of sections in the README.
    - **## Installation Instructions**: Provide detailed steps to install the project. Example: \`\`\`bash\n npm install \`\`\`
    - **## Usage Instructions**: How to use the project once set up. Example: \`\`\`bash\n npm start \`\`\`
    - **## Features**: Key features of the project.
    - **## Contributing Guidelines**: Instructions on how others can contribute to the project.
    - **## License**: License information (e.g., MIT, GPL).
    - **## Badges**: Add badges if available (e.g., build status, version).
    - **## Screenshots**: Optional screenshots or images for the project.
    - **## FAQs**: Frequently asked questions and their answers.
    - **## Roadmap**: If applicable, include the project roadmap for future development.
    - **## Contact Information**: Information on how to contact the project owner.
    - **## Test Instructions**: How to run tests for the project.
    - **## Deployment Instructions**: How to deploy the project.
    - **## Acknowledgments**: Credits or thanks to contributors or inspirations.

    Use proper Markdown formatting, and leave placeholders for images, badges, and links where necessary. Provide content for each section if possible, otherwise include placeholder text like "Coming soon".
    Ensure proper Markdown formatting and provide placeholders for images or links where necessary.
  `;

  try {
    // Call OpenAI API to generate README content
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4', // Updated model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000, // Adjust token limit as needed
    });

    // Send the generated README content as the response
    res.json({
      readme: response.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error('Error generating README:', error);
    res.status(500).json({ error: 'Failed to generate README' });
  }
});

/**
 * @route GET /api/health
 * @desc Health check endpoint to verify server status
 * @returns {string} Server status message
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running and healthy' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

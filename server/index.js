/**
Finance Tracker backend (Express) - sends real OTP emails via SMTP configured in .env.
Converted to ES modules.

Run:
  cd server
  npm install
  copy .env.example to .env and fill values (especially EMAIL_* and MONGO_URI)
  npm run dev
*/

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import txRoutes from './routes/transactions.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tx', txRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
});

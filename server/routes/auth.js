import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from "dns";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, 
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  }
});






async function sendOtpEmail(email, code){
  const html = `<p>Your Finance Tracker OTP code is: <b>${code}</b></p><p>It will expire in 10 minutes.</p>`;
  const mail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Finance Tracker OTP',
    html
  };
  try {
    const info = await transporter.sendMail(mail);
    console.log('OTP email sent:', info.messageId || info);
    return true;
  } catch (err) {
    // If sending fails, still return false but log the OTP so developer can use it for testing
    console.warn('Failed to send OTP email. OTP (logged):', code, err.message);
    return false;
  }
}

// Signup -> create user with hashed password and send OTP to real email
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email already in use' });
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = new User({ username, email, passwordHash });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = { code, expiresAt: new Date(Date.now() + 10*60*1000) };
    await user.save();
    const sent = await sendOtpEmail(email, code);
    if(!sent){
      // 
      return res.json({ message: 'Signup created, but email sending failed. Check server logs for OTP.' });
    }
    res.json({ message: 'Signup created. Verify the OTP sent to your email.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/verify-signup', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid email' });
    if(!user.otp || user.otp.code !== code) return res.status(400).json({ message: 'Invalid OTP' });
    if(new Date() > new Date(user.otp.expiresAt)) return res.status(400).json({ message: 'OTP expired' });
    user.otp = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Email not found' });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = { code, expiresAt: new Date(Date.now() + 10*60*1000) };
    await user.save();
    const sent = await sendOtpEmail(email, code);
    if(!sent){
      return res.json({ message: 'OTP created but email sending failed. Check server logs for OTP.' });
    }
    res.json({ message: 'OTP sent to email' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/verify-forgot', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    if(!user || !user.otp || user.otp.code !== code) return res.status(400).json({ message: 'Invalid OTP' });
    if(new Date() > new Date(user.otp.expiresAt)) return res.status(400).json({ message: 'OTP expired' });
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    user.otp = undefined;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

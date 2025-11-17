import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from "dns";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

// Setup mailer (same as auth.js)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // FORCE IPv4
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  }
});


async function sendOtp(email, code){
  try{
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Profile Update OTP",
      text: "Your OTP is: " + code
    });
    return true;
  }catch(e){
    console.warn("Email send failed", e);
    return false;
  }
}

// Request OTP
router.post('/request-otp', auth, async(req,res)=>{
  const user = await User.findById(req.user.id);
  if(!user) return res.status(404).json({message:'Not found'});
  const code = Math.floor(100000 + Math.random()*900000).toString();
  user.otp = { code, expiresAt: new Date(Date.now()+10*60*1000) };
  await user.save();
  await sendOtp(user.email, code);
  res.json({message:'OTP sent'});
});

// Get profile
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash -otp');
  res.json(user);
});

// Update profile (requires OTP)
router.put('/update', auth, async (req, res) => {
  const { username, email, otp } = req.body;
  const user = await User.findById(req.user.id);
  if(!user) return res.status(404).json({ message: 'Not found' });

  if(!otp || !user.otp || user.otp.code !== otp)
    return res.status(400).json({message:'Invalid OTP'});
  if(new Date() > new Date(user.otp.expiresAt))
    return res.status(400).json({message:'OTP expired'});

  if(username) user.username = username;
  if(email) user.email = email;
  user.otp = undefined;
  await user.save();
  res.json({ message:'Updated' });
});

// Change password (requires OTP)
router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword, otp } = req.body;
  const user = await User.findById(req.user.id);

  if(!otp || !user.otp || user.otp.code !== otp)
    return res.status(400).json({message:'Invalid OTP'});
  if(new Date() > new Date(user.otp.expiresAt))
    return res.status(400).json({message:'OTP expired'});

  const ok = bcrypt.compareSync(oldPassword, user.passwordHash);
  if(!ok) return res.status(400).json({ message: 'Old password incorrect' });

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(newPassword, salt);
  user.otp = undefined;
  await user.save();
  res.json({ message: 'Password changed' });
});

export default router;

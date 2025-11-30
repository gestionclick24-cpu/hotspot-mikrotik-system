const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail } = require('../models/user');
const passport = require('passport');
const { setupGoogleStrategy, setupAppleStrategy } = require('../services/oauth');
const db = require('../db');

setupGoogleStrategy(passport);
setupAppleStrategy(passport);

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error:'missing' });
  const existing = await findByEmail(email);
  if(existing) return res.status(400).json({ error:'exists' });
  const hash = await bcrypt.hash(password, 10);
  const id = await createUser({ email, passwordHash: hash, provider:'local' });
  const token = jwt.sign({ id, email }, JWT_SECRET);
  res.json({ token });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if(!user) return res.status(401).json({ error:'invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error:'invalid' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token });
});

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { session:false, failureRedirect: '/' }), (req,res)=>{
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET);
  res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
});

router.get('/apple', passport.authenticate('apple'));
router.post('/apple/callback', passport.authenticate('apple', { session:false }), (req,res)=>{
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET);
  res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
});

module.exports = router;

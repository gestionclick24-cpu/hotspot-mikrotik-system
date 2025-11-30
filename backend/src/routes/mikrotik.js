const express = require('express');
const router = express.Router();
const { addHotspotUser, removeHotspotUser } = require('../services/mikrotikClient');
const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error:'noauth' });
  const token = header.split(' ')[1];
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = data;
    next();
  }catch(e){
    res.status(401).json({ error:'invalid' });
  }
}

router.post('/user', authMiddleware, async (req,res)=>{
  const { username, password, profile } = req.body;
  try{
    const r = await addHotspotUser(username, password, profile);
    res.json({ ok:true, r });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

router.delete('/user/:username', authMiddleware, async (req,res)=>{
  const username = req.params.username;
  try{
    await removeHotspotUser(username);
    res.json({ ok:true });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

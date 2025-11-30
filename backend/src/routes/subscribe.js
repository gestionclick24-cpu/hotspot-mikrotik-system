const express = require('express');
const router = express.Router();
const { getPlan } = require('../models/plan');
const { createSubscription } = require('../models/subscription');
const { addHotspotUser } = require('../services/mikrotikClient');

function randStr(len=8){
  return Math.random().toString(36).slice(2,2+len);
}

router.post('/', async (req,res)=>{
  const { user_id, plan_id } = req.body;
  const plan = await getPlan(plan_id);
  if(!plan) return res.status(404).json({ error:'no-plan' });

  const username = `u${Date.now()}${randStr(3)}`;
  const password = randStr(10);
  const started_at = new Date();
  const expires_at = new Date(started_at.getTime() + plan.duration_days * 24*60*60*1000);

  await addHotspotUser(username, password, plan.mikrotik_profile);
  const s = await createSubscription({ user_id, plan_id, username, password, started_at, expires_at });
  res.json({ ok:true, subscription: s });
});

module.exports = router;

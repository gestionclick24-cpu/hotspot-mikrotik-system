const express = require('express');
const router = express.Router();
const { listPlans, createPlan, updatePlan, deletePlan } = require('../models/plan');

router.get('/', async (req,res)=>{
  const plans = await listPlans();
  res.json(plans);
});

router.post('/', async (req,res)=>{
  const data = req.body;
  const [p] = await createPlan(data);
  res.json(p);
});

router.put('/:id', async (req,res)=>{
  const id = req.params.id;
  const [p] = await updatePlan(id, req.body);
  res.json(p);
});

router.delete('/:id', async (req,res)=>{
  await deletePlan(req.params.id);
  res.json({ ok:true });
});

module.exports = router;

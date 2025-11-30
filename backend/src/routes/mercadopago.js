const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const db = require('../db');
const { getPlan } = require('../models/plan');
const { createSubscription } = require('../models/subscription');
const { addHotspotUser } = require('../services/mikrotikClient');
const { sendWelcomeWithCredentials } = require('../services/mailer');

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN || '');

router.post('/create_preference', async (req, res) => {
  try{
    const { plan_id, user_id, payer_email } = req.body;
    const plan = await getPlan(plan_id);
    if(!plan) return res.status(404).json({ error: 'plan_not_found' });

    const unit_price = (plan.price_cents || 0) / 100;

    const preference = {
      items: [{
        id: String(plan.id),
        title: plan.name,
        unit_price,
        quantity: 1
      }],
      payer: { email: (payer_email || null) },
      back_urls: {
        success: process.env.APP_URL + '/payment/success',
        failure: process.env.APP_URL + '/payment/failure',
        pending: process.env.APP_URL + '/payment/pending'
      },
      notification_url: process.env.APP_URL + '/api/mp/webhook'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point, preferenceId: response.body.id });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/webhook', express.json(), async (req, res) => {
  try{
    const body = req.body;
    const resource = body.data || body;
    const paymentId = (resource.id || (resource && resource.id));
    if(!paymentId) return res.status(200).send('ok');

    const payment = await mercadopago.payment.findById(paymentId);
    const p = payment.body || payment;

    if(p.status === 'approved'){
      const item = (p.additional_info && p.additional_info.items && p.additional_info.items[0]) || (p.order && p.order.items && p.order.items[0]);
      const planId = item && item.id;
      const userEmail = p.payer && p.payer.email;

      const user = await db('users').where({ email: userEmail }).first();
      if(!user) return res.status(200).send('user-not-found');

      const plan = await getPlan(planId);
      if(!plan) return res.status(200).send('plan-not-found');

      const username = `u${Date.now()}${Math.random().toString(36).slice(2,5)}`;
      const password = Math.random().toString(36).slice(2,10);
      const started_at = new Date();
      const expires_at = new Date(started_at.getTime() + plan.duration_days * 24*60*60*1000);

      await addHotspotUser(username, password, plan.mikrotik_profile);
      await createSubscription({ user_id: user.id, plan_id: plan.id, username, password, started_at, expires_at });
      await sendWelcomeWithCredentials(user.email, username, password, expires_at);
      console.log('Subscription created for', user.email);
    }

    res.status(200).send('ok');
  }catch(err){
    console.error('MP webhook error', err);
    res.status(500).send('error');
  }
});

module.exports = router;

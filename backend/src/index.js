require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./db');
const path = require('path');

const authRoutes = require('./routes/auth');
const mikrotikRoutes = require('./routes/mikrotik');
const plansRoutes = require('./routes/plans');
const subscribeRoutes = require('./routes/subscribe');
const mpRoutes = require('./routes/mercadopago');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json());
app.use(passport.initialize());

(async ()=>{
  const exists = await db.schema.hasTable('users');
  if(!exists){
    await db.schema.createTable('users', t =>{
      t.increments('id');
      t.string('email').unique();
      t.string('password');
      t.string('provider');
      t.string('provider_id');
      t.boolean('verified').defaultTo(false);
      t.timestamps(true, true);
    });
  }
  if(!(await db.schema.hasTable('plans'))){
    await db.schema.createTable('plans', t=>{
      t.increments('id');
      t.string('name');
      t.integer('price_cents').defaultTo(0);
      t.integer('duration_days').defaultTo(1);
      t.integer('max_sessions').defaultTo(1);
      t.string('mikrotik_profile').defaultTo('default');
      t.timestamps(true,true);
    });
  }
  if(!(await db.schema.hasTable('subscriptions'))){
    await db.schema.createTable('subscriptions', t=>{
      t.increments('id');
      t.integer('user_id').references('users.id').onDelete('CASCADE');
      t.integer('plan_id').references('plans.id').onDelete('SET NULL');
      t.string('username');
      t.string('password');
      t.timestamp('started_at').defaultTo(db.fn.now());
      t.timestamp('expires_at').notNullable();
      t.boolean('active').defaultTo(true);
      t.timestamp('created_at').defaultTo(db.fn.now());
    });
  }
})();

app.use('/auth', authRoutes);
app.use('/mikrotik', mikrotikRoutes);
app.use('/plans', plansRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/api/mp', mpRoutes);

// jobs
require('./jobs/expireSubscriptions');

app.get('/', (req,res)=> res.json({ ok:true, now: new Date() }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend listening on', PORT));

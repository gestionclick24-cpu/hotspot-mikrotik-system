const db = require('../db');

async function createSubscription({ user_id, plan_id, username, password, started_at, expires_at }){
  const [s] = await db('subscriptions').insert({ user_id, plan_id, username, password, started_at, expires_at }).returning('*');
  return s;
}

async function getExpiringOrExpired(now){
  return db('subscriptions').where('active', true).andWhere('expires_at', '<=', now).select('*');
}

async function setSubscriptionInactive(id){
  return db('subscriptions').where({ id }).update({ active:false });
}

module.exports = { createSubscription, getExpiringOrExpired, setSubscriptionInactive };

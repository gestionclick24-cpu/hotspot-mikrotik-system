const cron = require('node-cron');
const { getExpiringOrExpired, setSubscriptionInactive } = require('../models/subscription');
const { removeHotspotUser } = require('../services/mikrotikClient');

cron.schedule('5 0 * * *', async ()=>{
  const now = new Date();
  const list = await getExpiringOrExpired(now);
  for(const s of list){
    try{
      await removeHotspotUser(s.username);
      await setSubscriptionInactive(s.id);
      console.log('Expired subscription', s.id);
    }catch(e){
      console.error('Error expiring', s.id, e.message);
    }
  }
});
module.exports = {};

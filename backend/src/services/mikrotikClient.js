const { RouterOSClient } = require('node-routeros');

async function withMikrotik(fn){
  const client = new RouterOSClient({
    host: process.env.MIKROTIK_HOST,
    user: process.env.MIKROTIK_USER,
    password: process.env.MIKROTIK_PASS,
    port: parseInt(process.env.MIKROTIK_PORT || '8728', 10)
  });
  try{
    await client.connect();
    return await fn(client);
  }finally{
    try{ client.close(); }catch(e){}
  }
}

async function addHotspotUser(username, password, profile='default'){
  return withMikrotik(async client=>{
    const api = client.openChannel();
    const res = await api.write('/ip/hotspot/user/add', ['=name=' + username, '=password=' + password, '=profile=' + profile]);
    api.close();
    return res;
  });
}

async function removeHotspotUser(username){
  return withMikrotik(async client=>{
    const api = client.openChannel();
    const users = await api.write('/ip/hotspot/user/print', ['?name=' + username]);
    if(users && users.length){
      const id = users[0]['.id'];
      const res = await api.write('/ip/hotspot/user/remove', ['=.id=' + id]);
      api.close();
      return res;
    }
    api.close();
    return null;
  });
}

module.exports = { addHotspotUser, removeHotspotUser };

import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => {
  console.log('Connected to Redis Server');
});

await client.connect();

// class Redis {
function setValue(key, value, ttl) {
  client.set(key, value, { EX: ttl }, (err) => {
    return err;
  })
}

function getValue(key) {
  client.get(key, (err) => {
    return err;
  })
}

function delValue(key) {
  client.del(key, (err) => {
    return err;
  })
}

export {
  setValue,
  getValue,
  delValue
}



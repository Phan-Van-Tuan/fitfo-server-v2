import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => {
  console.log('Connected to Redis Server');
});

await client.connect();

// class Redis {
async function setValue(key, value, ttl) {
  try {
    await client.set(key, value, { EX: ttl });
    return true; // hoặc trả về bất cứ giá trị nào bạn muốn khi thành công
  } catch (error) {
    throw error;
  }
}

async function getValue(key) {
  try {
    const data = await client.get(key);
    return data;
  } catch (error) {
    throw error;
  }
}

async function delValue(key) {
  try {
    await client.del(key);
    return true; // hoặc trả về bất cứ giá trị nào bạn muốn khi thành công
  } catch (error) {
    throw error;
  }
}


export {
  setValue,
  getValue,
  delValue
}



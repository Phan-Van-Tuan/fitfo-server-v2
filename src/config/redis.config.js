// redisClient.js
import { createClient } from 'redis';
const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('👌 Connected to Redis Server'));

await client.connect();

// class Redis {
function setValue(key, value, ttl) {
    return new Promise(async (resolve, reject) => {
        await client.set(key, value, { EX: ttl }, (err) => { reject(err) });
        resolve();
    });

}

function getValue(key) {
    return new Promise(async (resolve, reject) => {
        const data = await client.get(key, (err) => { reject(err) });
        resolve(data);
    });
}

async function delValue(key) {
    return new Promise(async (resolve, reject) => {
        await client.del(key, (err) => { reject(err) });
        resolve();
    });
}

export {
    setValue,
    getValue,
    delValue
}

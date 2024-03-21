import { createClient } from 'redis';
const client = createClient();

client.on('error', (err) => {
    throw err;
});
client.on('connect', () => console.log('👌 Connected to Redis Server'));

await client.connect();

async function setValue(key, value, ttl) {
    try {
        await client.set(key, value, { EX: ttl });
        return true;
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
        return true;
    } catch (error) {
        throw error;
    }
}

export {
    setValue,
    getValue,
    delValue
}
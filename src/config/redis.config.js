import { createClient } from 'redis';
const client = createClient();

class RedisConnection {
    static async init() {
        client.on('error', (err) => { });
        client.on('connect', () => console.log('👌 Connected to Redis Server'));

        await client.connect();
        return client;
    }
}

export default RedisConnection;
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => {
    console.log('Connected to Redis Server');
});

await client.connect();



// Function to get a value from Redis
function getValue(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }
  
  // Function to set a value in Redis with an optional TTL
  function setValue(key, value, ttl) {
    return new Promise((resolve, reject) => {
      client.set(key, value, (err) => {
        if (err) {
          reject(err);
        } else {
          if (ttl) {
            client.expire(key, ttl, (expireErr) => {
              if (expireErr) {
                reject(expireErr);
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        }
      });
    });
  }
  
  // Function to delete a key from Redis
  function deleteKey(key) {
    return new Promise((resolve, reject) => {
      client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  // Function to get the TTL of a key in seconds
  function getKeyTTL(key) {
    return new Promise((resolve, reject) => {
      client.ttl(key, (err, ttl) => {
        if (err) {
          reject(err);
        } else {
          resolve(ttl);
        }
      });
    });
  }
  
  // Example usage
  async function exampleUsage() {
    const key = 'myKey';
    const value = 'myValue';
    const ttl = 60; // TTL in seconds
  
    // Set value with TTL
    await setValue(key, value, ttl);
  
    // Get value
    const retrievedValue = await getValue(key);
    console.log('Retrieved value:', retrievedValue);
  
    // Get TTL
    const keyTTL = await getKeyTTL(key);
    console.log('Time to live (TTL):', keyTTL, 'seconds');
  
    // Delete key
    await deleteKey(key);
  
    // After deletion, attempting to get the value should return null
    const deletedValue = await getValue(key);
    console.log('Deleted value:', deletedValue);
  }
  
  // Execute example
  exampleUsage();




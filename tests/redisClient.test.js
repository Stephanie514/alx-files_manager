const redisClient = require('../utils/redis');

describe('Redis Client Tests', () => {
  it('should connect to Redis successfully', async () => {
    expect(redisClient.isAlive()).toBeTruthy();
  });

  it('should set and get values from Redis', async () => {
    await redisClient.set('testKey', 'testValue', 60); // Setting value with 60 seconds expiry
    const value = await redisClient.get('testKey');
    expect(value).toBe('testValue');
  });

  it('should delete a value from Redis', async () => {
    await redisClient.del('testKey');
    const value = await redisClient.get('testKey');
    expect(value).toBeNull();
  });
});

const dbClient = require('../utils/db');

describe('DB Client Tests', () => {
  it('should connect to MongoDB successfully', async () => {
    expect(dbClient.isAlive()).toBeTruthy();
  });

  it('should fetch the number of users from MongoDB', async () => {
    const numUsers = await dbClient.nbUsers();
    expect(numUsers).toBeGreaterThanOrEqual(0);
  });

  it('should fetch the number of files from MongoDB', async () => {
    const numFiles = await dbClient.nbFiles();
    expect(numFiles).toBeGreaterThanOrEqual(0);
  });

});

const crypto = require('crypto');
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      // Validate the request body
      if (!email) return res.status(400).json({ error: 'Missing email' });
      if (!password) return res.status(400).json({ error: 'Missing password' });

      // Checking if the user already exists
      const existingUser = await dbClient.db.collection('users').findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Already exist' });

      // Password Hashed
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // New user object created
      const newUser = { email, password: hashedPassword };

      // Inserting the new user to the database
      const result = await dbClient.db.collection('users').insertOne(newUser);

      // Returning newly created user
      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.error('Error in postNew:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    try {
      const token = req.headers['x-token'];
      if (!token) return res.status(401).json({ error: 'Unauthorized' });

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) }, { projection: { email: 1 } });
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      return res.status(200).json({ id: user._id, email: user.email });
    } catch (error) {
      console.error('Error in getMe:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;

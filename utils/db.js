const { MongoClient, ObjectId } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = database;
    this.db = null; // Initializing db reference

    this.connect();
  }

  connect() {
    this.client.connect((err) => {
      if (err) {
        console.error(`Failed to connect to the database. ${err.stack}`);
      } else {
        console.log('Connected to MongoDB');
        this.db = this.client.db(this.dbName);
      }
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    try {
      if (!this.isAlive()) return 0;
      const collection = this.db.collection('users');
      const count = await collection.countDocuments();
      return count;
    } catch (error) {
      console.error(`Error counting users: ${error.message}`);
      return 0;
    }
  }

  async nbFiles() {
    try {
      if (!this.isAlive()) return 0;
      const collection = this.db.collection('files');
      const count = await collection.countDocuments();
      return count;
    } catch (error) {
      console.error(`Error counting files: ${error.message}`);
      return 0;
    }
  }

  async findFileById(id) {
    try {
      if (!this.isAlive() || !ObjectId.isValid(id)) return null;
      const collection = this.db.collection('files');
      const file = await collection.findOne({ _id: new ObjectId(id) });
      return file;
    } catch (error) {
      console.error(`Error finding file by id: ${error.message}`);
      return null;
    }
  }

  async updateUserById(id, userData) {
    try {
      if (!this.isAlive() || !ObjectId.isValid(id)) return false;
      const collection = this.db.collection('users');
      const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: userData });
      return result.modifiedCount > 0;
    } catch (error) {
      console.error(`Error updating user by id: ${error.message}`);
      return false;
    }
  }

  async deleteUserById(id) {
    try {
      if (!this.isAlive() || !ObjectId.isValid(id)) return false;
      const collection = this.db.collection('users');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting user by id: ${error.message}`);
      return false;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

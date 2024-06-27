const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = database;
        this.db = null; // Initialize db reference

        this.connect();
    }

    connect() {
        this.client.connect(err => {
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
}

const dbClient = new DBClient();
module.exports = dbClient;

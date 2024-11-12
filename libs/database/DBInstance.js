import  { MongoClient } from "mongodb";


class MongoDBManager {
    constructor(connectionStr, dbName) {
        this.connectionStr = connectionStr;
        this.dbName = dbName;
        this.client = new MongoClient(connectionStr);
    }
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw (error)
        }
    }
    async disconnect() {
        try {
            await this.client.close();
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw (error)
        }
    }
    async findOne(collectionName, filter) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.findOne(filter);
        } catch (error) {
            console.error('Error finding document:', error);
            throw error;
        }
    }
    async findMany(collectionName, filter) {
        try {
            const collection = this.db.collection(collectionName);
            const cursor = collection.find(filter);
            return await cursor.toArray();
        } catch (error) {
            console.error('Error finding documents:', error);
            throw error;
        }
    }
    async insertOne(collectionName, document) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.insertOne(document);

        } catch (error) {
            console.error('Error inserting document:', error);
            throw error;
        }
    }

    async insertMany(collectionName, documents) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.insertMany(documents);


        }catch (error) {
            console.error('Error finding document:', error);
            throw error;
        }
    }
    async updateOne(collectionName, filter, update) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.updateOne(filter, update);

        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }
    async replaceOne(collectionName, filter,doc) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.findOneAndReplace(filter, doc);

        } catch (error) {
            console.error('Error replace document:', error);
            throw error;
        }
    }

    async updateMany(collectionName, filter, update) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.updateMany(filter, update);

        } catch (error) {
            console.error('Error updating documents:', error);
            throw error;
        }
    }

    async deleteOne(collectionName, filter) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.deleteOne(filter);

        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }

    async deleteMany(collectionName, filter) {
        try {
            const collection = this.db.collection(collectionName);
            return await collection.deleteMany(filter);

        } catch (error) {
            console.error('Error deleting documents:', error);
            throw error;
        }
    }
    async createCollection(collectionName) {
      await this.deleteMany(collectionName, {})
    }

}
export default MongoDBManager;
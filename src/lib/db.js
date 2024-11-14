// src/lib/db.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://tech:TLmWUzw9MXweWFUN@cluster0.7fpyy.mongodb.net/';

export async function connectToDatabase() {
	const client = new MongoClient(uri);
	try {
		const mongoClient = await client.connect();
		return mongoClient
	} catch (error) {
     console.error("connection not established", error);
     process.exit()
    }
}

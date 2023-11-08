import * as mongoDB from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const DB_USER = process.env.DB_USER

const DB_PASSWORD = process.env.DB_PASSWORD;

const encodedPassword = encodeURIComponent(DB_PASSWORD!);

const DB_URL = process.env.DB_URL

const CONNECTION_URL = `mongodb+srv://${DB_USER}:${encodedPassword}${DB_URL}`

const DB_NAME = process.env.DB_NAME;

const ITEM_COLLECTION = process.env.ITEM_COLLECTION;

let itemCollection: mongoDB.Collection;

export async function connectToDatabase() {

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(CONNECTION_URL);

    await client.connect();

    const db: mongoDB.Db = client.db(DB_NAME);

    itemCollection = db.collection(ITEM_COLLECTION!);

}

export async function findItems(query: {}) {
    try {
        const items = await itemCollection.find(query).toArray();
        return items;
    } catch (error) {
        console.error("Error finding items:", error);
        throw error;
    }
}
import * as mongoDB from "mongodb";

let itemCollection: mongoDB.Collection 

export async function connectToDatabase() {

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_URL!);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    itemCollection = db.collection(process.env.ITEM_COLLECTION!);
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

let query = {title: "ruokapöytä"};
console.log(findItems(query));
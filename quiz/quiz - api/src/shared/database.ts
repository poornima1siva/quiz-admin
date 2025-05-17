import { Db, MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://poornimasivagnanam:poorni@elementarcluster.tdf8q.mongodb.net/?retryWrites=true&w=majority&appName=elementarCluster";
export let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (cachedDb) {
        console.log("Using cached database connection");
        return cachedDb;
    }

    try {
        // Connect to MongoDB Atlas (without outdated options)
        const client = await MongoClient.connect(MONGODB_URI);

        // Use the correct database
        const db = client.db("quiz"); // Change "testing" to "quiz"
        cachedDb = db;

        console.log("Connected to MongoDB:", db.databaseName);
        return db;
    } catch (error) {
        console.error("DB connection failed:", error);
        throw error;
    }
}

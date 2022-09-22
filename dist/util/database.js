"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = exports.collectionsDB = void 0;
const mongodb_1 = require("mongodb");
exports.collectionsDB = {};
async function connectToDB() {
    const client = new mongodb_1.MongoClient(process.env.DB_CONNECTION);
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection(process.env.USER_COLLECTION_NAME);
    const tilesCollection = db.collection(process.env.TILE_COLLECTION_NAME);
    exports.collectionsDB.users = usersCollection;
    exports.collectionsDB.tiles = tilesCollection;
    console.log(`Successfully connected to database: ${db.databaseName}`);
}
exports.connectToDB = connectToDB;

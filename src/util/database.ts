import dotenv from "dotenv";
import { Collection, Db, MongoClient } from "mongodb";
import { Tile } from "../models/tile.model";
import { User } from "../models/user.model";

export const collectionsDB: {
  users?: Collection<User>;
  tiles?: Collection<Tile>;
} = {};

export async function connectToDB() {
  const client: MongoClient = new MongoClient(process.env.DB_CONNECTION!);

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  const usersCollection: Collection<User> = db.collection(
    process.env.USER_COLLECTION_NAME!
  );
  const tilesCollection: Collection<Tile> = db.collection(
    process.env.TILE_COLLECTION_NAME!
  );

  collectionsDB.users = usersCollection;
  collectionsDB.tiles = tilesCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}

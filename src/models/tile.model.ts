import { ObjectId } from "mongodb";

export interface Tile {
  _id: ObjectId;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

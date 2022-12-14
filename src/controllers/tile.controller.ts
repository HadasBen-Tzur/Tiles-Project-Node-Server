import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
//import { ObjectId } from "bson";
import { Tile } from "../models/tile.model";
import { collectionsDB } from "../util/database";

//Get all Tiles
export const getAllTiles: RequestHandler = async (req, res) => {
  const tiles = await collectionsDB.tiles?.find({}).toArray();
  if (tiles) {
    res.status(200).send(tiles);
  }
};
//Bulk save Tiles
export const updateTilesService: RequestHandler<ObjectId> = async (
  req,
  res
) => {
  const tilesAdded = req.body.tilesAdded as Tile[];
  const tilesRemoved = req.body.tilesRemoved as ObjectId[];
  const tilesUpdated = req.body.tilesUpdated as Tile[];
  try {
    const added = tilesAdded.map((tile) => ({
      insertOne: {
        document: {
          _id: new ObjectId(tile._id),
          color: tile.color,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }));
    const updated = tilesUpdated.map((tile) => ({
      updateOne: {
        filter: { _id: new ObjectId(tile._id) },
        update: { $set: { color: tile.color, updatedAt: new Date() } },
      },
    }));
    const removed = tilesRemoved.map((tile) => ({
      deleteOne: { filter: { _id: new ObjectId(tile) } },
    }));
    collectionsDB.tiles?.bulkWrite([...added, ...removed, ...updated]);
  } catch (error) {}
};

// //Get all Tile + User name instead of id / Get search title
// export const getAllTilesForUser: RequestHandler = async (req, res) => {
//   let search = req.query.search;
//   if (!search) {
//     const tiles = await collectionsDB.tiles
//       ?.aggregate([
//         {
//           $lookup: {
//             from: "Users",
//             localField: "user",
//             foreignField: "_id",
//             pipeline: [{ $project: { name: 1, _id: 0 } }],
//             as: "userName",
//           },
//         },
//         {
//           $unwind: "$userName",
//         },
//       ])
//       .toArray();
//     const finalTile = tiles?.map((tile: any) => {
//       const prop: any = {
//         ...tile,
//         user: tile.userName.name,
//       };
//       const { userName, ...rest } = tile;
//       return rest;
//     });
//     res.status(200).send(finalTile);
//     return;
//   }
//   const tiles = await collectionsDB.tiles
//     ?.find({ title: { $regex: "^" + search } })
//     .toArray();
//   if (tiles) {
//     res.status(200).send(tiles);
//   }
// };

// //creat new Tile
// export const createTile: RequestHandler = async (req, res) => {
//   const tile: Tile | undefined = req.body;
//   if (!tile) {
//     res.status(400).send("Tile is undefined");
//     return;
//   }
//   const result = await collectionsDB.tiles?.insertOne({
//     ...tile,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });
//   if (!result) {
//     res.status(500).send("Not create tile ????");
//     return;
//   }
//   res.status(201).send("Tile created successfully ????");
// };

// //Get Tile by Id
// export const getTileById: RequestHandler<ObjectId> = async (req, res) => {
//   const id: ObjectId | undefined = req.params;
//   if (!id) {
//     res.status(400).send("IdTile is undefined");
//     return;
//   }
//   try {
//     const idTile = { _id: new ObjectId(id) };
//     const tile = (await collectionsDB.tiles?.findOne(idTile)) as Tile;
//     if (tile) {
//       res.status(200).send(tile);
//     }
//   } catch (error) {
//     res.status(404).send(`Can not find tile with id: ${req.params.id}`);
//   }
// };

// //Update Tile
// export const updateTile: RequestHandler<ObjectId> = async (req, res) => {
//   const id: ObjectId | undefined = req.params;
//   const tile: Tile | undefined = req.body;
//   if (!id || !tile) {
//     res.status(400).send("Tile/Id is undefined");
//     return;
//   }
//   const idTile = { _id: new ObjectId(id) };
//   const result = await collectionsDB.tiles?.updateOne(idTile, {
//     $set: { ...tile, updatedAt: new Date() },
//   });
//   if (!result) {
//     res.status(500).send("Not update tile ????");
//     return;
//   }
//   res.status(200).send("Tile update successfully ????");
// };

// //Delete Tile
// export const deleteTile: RequestHandler<ObjectId> = async (req, res) => {
//   const id: ObjectId | undefined = req.params;
//   if (!id) {
//     res.status(400).send("IdTile is undefined");
//     return;
//   }
//   const idTile = { _id: new ObjectId(id) };
//   const result = await collectionsDB.tiles?.deleteOne(idTile);
//   if (!result) {
//     res.status(500).send("Not delete tile ????");
//     return;
//   }
//   res.status(200).send("Tile delete successfully ????");
// };

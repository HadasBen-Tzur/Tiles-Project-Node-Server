import express from "express";
import {
  getAllTiles,
  updateTilesService,
} from "../controllers/tile.controller";
import { getMiddlewareJWT } from "../middlewars/auth.middleware";
import { collectionsDB } from "../util/database";

export const tileRout = express.Router();

tileRout.use((_req, _res, next) => {
  if (!collectionsDB.tiles) {
    throw new Error("Not Find Post");
  }
  next();
});
tileRout.use("/", getMiddlewareJWT);
// tileRout.route("/:id").get(getTileById).put(updateTile).delete(deleteTile);
tileRout
  .route("/")
  .get(getAllTiles)
  // .post(createTile)
  // .get(getAllTilesForUser)
  .put(updateTilesService);
// tileRout.route("/user/:id").get(getTilesFromUser);

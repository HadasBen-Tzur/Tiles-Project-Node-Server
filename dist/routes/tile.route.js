"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileRout = void 0;
const express_1 = __importDefault(require("express"));
const tile_controller_1 = require("../controllers/tile.controller");
const auth_middleware_1 = require("../middlewars/auth.middleware");
const database_1 = require("../util/database");
exports.tileRout = express_1.default.Router();
exports.tileRout.use((_req, _res, next) => {
    if (!database_1.collectionsDB.tiles) {
        throw new Error("Not Find Post");
    }
    next();
});
exports.tileRout.use("/", auth_middleware_1.getMiddlewareJWT);
// tileRout.route("/:id").get(getTileById).put(updateTile).delete(deleteTile);
exports.tileRout
    .route("/")
    .get(tile_controller_1.getAllTiles)
    // .post(createTile)
    // .get(getAllTilesForUser)
    .put(tile_controller_1.updateTilesService);
// tileRout.route("/user/:id").get(getTilesFromUser);

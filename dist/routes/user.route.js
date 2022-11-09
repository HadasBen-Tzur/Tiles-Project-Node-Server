"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRout = void 0;
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const auth_middleware_1 = require("../middlewars/auth.middleware");
const database_1 = require("../util/database");
exports.userRout = express_1.default.Router();
exports.userRout.use((_req, _res, next) => {
    if (!database_1.collectionsDB.users) {
        throw new Error("Not Find User");
    }
    next();
});
exports.userRout.route("/:id").get(user_controllers_1.getUserById).put(user_controllers_1.updateUser).delete(user_controllers_1.deleteUser);
exports.userRout
    .route("/")
    .get(auth_middleware_1.getMiddlewareJWT, user_controllers_1.getAllUsers)
    .put(user_controllers_1.updateUsersService)
    .post(user_controllers_1.createUser);
exports.userRout.route("/login").post(user_controllers_1.CreatJWT);

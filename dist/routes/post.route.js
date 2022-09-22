"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRout = void 0;
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const database_1 = require("../util/database");
exports.postRout = express_1.default.Router();
exports.postRout.use((_req, _res, next) => {
    if (!database_1.collectionsDB.posts) {
        throw new Error("Not Find Post");
    }
    next();
});
exports.postRout.route("/:id").get(post_controller_1.getPortById).put(post_controller_1.updatePost).delete(post_controller_1.deletePost);
exports.postRout.route("/").get(post_controller_1.getAllPosts).post(post_controller_1.createPost);
exports.postRout.route("/user/:id").get(post_controller_1.getPostsFromUser);

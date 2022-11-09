import express from "express";
import {
  createUser,
  CreatJWT,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUsersService,
} from "../controllers/user.controllers";
import { getMiddlewareJWT } from "../middlewars/auth.middleware";
import { collectionsDB } from "../util/database";

export const userRout = express.Router();

userRout.use((_req, _res, next) => {
  if (!collectionsDB.users) {
    throw new Error("Not Find User");
  }
  next();
});

userRout.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
userRout
  .route("/")
  .get(getMiddlewareJWT, getAllUsers)
  .put( updateUsersService)
  .post(createUser);
userRout.route("/login").post(CreatJWT);

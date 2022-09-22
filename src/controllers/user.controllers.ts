import { RequestHandler } from "express";
import { ObjectId, WithId } from "mongodb";
import { User } from "../models/user.model";
import { collectionsDB } from "../util/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Get all users
export const getAllUsers: RequestHandler = async (req, res) => {
  const users = await collectionsDB.users?.find({}).toArray();
  if (users) {
    res.status(200).send(users);
  }
};

//creat new user
export const createUser: RequestHandler = async (req, res) => {
  console.log(req.body);
  const user: User | undefined = req.body;
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  if (!user) {
    res.status(400).send("User is undefined");
    return;
  }
  const result = await collectionsDB.users?.insertOne({
    ...user,
  });
  if (!result) {
    res.status(500).send("Not create user 👎");
    return;
  }
  res.status(201).send("User created successfully 👍");
};

//Get user by Id
export const getUserById: RequestHandler<ObjectId> = async (req, res) => {
  const id: ObjectId | undefined = req.params;
  if (!id) {
    res.status(400).send("IdUser is undefined");
    return;
  }
  try {
    const idUser = { _id: new ObjectId(id) };
    const user = (await collectionsDB.users?.findOne(idUser)) as User;
    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(404).send(`Can not find user with id: ${req.params.id}`);
  }
};

//Update user
export const updateUser: RequestHandler<ObjectId> = async (req, res) => {
  const id: ObjectId | undefined = req.params;
  const user: User | undefined = req.body;
  if (!id || !user) {
    res.status(400).send("User/Id is undefined");
    return;
  }
  const idUser = { _id: new ObjectId(id) };
  const result = await collectionsDB.users?.updateOne(idUser, {
    $set: { ...user },
  });
  if (!result) {
    res.status(500).send("Not update user 👎");
    return;
  }
  res.status(200).send("User update successfully 👍");
};

//Delete user
export const deleteUser: RequestHandler<ObjectId> = async (req, res) => {
  const id: ObjectId | undefined = req.params;
  if (!id) {
    res.status(400).send("IdUser is undefined");
    return;
  }
  const idUser = { _id: new ObjectId(id) };
  const result = await collectionsDB.users?.deleteOne(idUser);
  if (!result) {
    res.status(500).send("Not delete user 👎");
    return;
  }
  res.status(200).send("User delete successfully 👍");
};

//Creating JWT token for User
export const CreatJWT: RequestHandler = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  let existingUser: WithId<User> | null | undefined;
  try {
    existingUser = await collectionsDB.users?.findOne({ email: email });
  } catch {
    res.status(400).send("There is no user from the above details");
  }
  const validPassword = await bcrypt.compare(password, existingUser!.password);
  if (!existingUser || !validPassword) {
    res.status(400).send("Error in identification details");
    return;
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        userName: existingUser.userName,
      },
      process.env.SECRET_KEY!,
      { expiresIn: "1h" }
    );
  } catch (err) {
    res.status(400).send("Error! Something went wrong.");
  }
  res.status(200).send({
    success: true,
    data: {
      token: token,
    },
  });
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatJWT = exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = exports.getAllUsers = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../util/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//Get all users
const getAllUsers = async (req, res) => {
    const users = await database_1.collectionsDB.users?.find({}).toArray();
    if (users) {
        res.status(200).send(users);
    }
};
exports.getAllUsers = getAllUsers;
//creat new user
const createUser = async (req, res) => {
    console.log(req.body);
    const user = req.body;
    const salt = await bcrypt_1.default.genSalt(10);
    req.body.password = await bcrypt_1.default.hash(req.body.password, salt);
    if (!user) {
        res.status(400).send("User is undefined");
        return;
    }
    const result = await database_1.collectionsDB.users?.insertOne({
        ...user,
    });
    if (!result) {
        res.status(500).send("Not create user 👎");
        return;
    }
    res.status(201).send("User created successfully 👍");
};
exports.createUser = createUser;
//Get user by Id
const getUserById = async (req, res) => {
    const id = req.params;
    if (!id) {
        res.status(400).send("IdUser is undefined");
        return;
    }
    try {
        const idUser = { _id: new mongodb_1.ObjectId(id) };
        const user = (await database_1.collectionsDB.users?.findOne(idUser));
        if (user) {
            res.status(200).send(user);
        }
    }
    catch (error) {
        res.status(404).send(`Can not find user with id: ${req.params.id}`);
    }
};
exports.getUserById = getUserById;
//Update user
const updateUser = async (req, res) => {
    const id = req.params;
    const user = req.body;
    if (!id || !user) {
        res.status(400).send("User/Id is undefined");
        return;
    }
    const idUser = { _id: new mongodb_1.ObjectId(id) };
    const result = await database_1.collectionsDB.users?.updateOne(idUser, {
        $set: { ...user },
    });
    if (!result) {
        res.status(500).send("Not update user 👎");
        return;
    }
    res.status(200).send("User update successfully 👍");
};
exports.updateUser = updateUser;
//Delete user
const deleteUser = async (req, res) => {
    const id = req.params;
    if (!id) {
        res.status(400).send("IdUser is undefined");
        return;
    }
    const idUser = { _id: new mongodb_1.ObjectId(id) };
    const result = await database_1.collectionsDB.users?.deleteOne(idUser);
    if (!result) {
        res.status(500).send("Not delete user 👎");
        return;
    }
    res.status(200).send("User delete successfully 👍");
};
exports.deleteUser = deleteUser;
//Creating JWT token for User
const CreatJWT = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await database_1.collectionsDB.users?.findOne({ email: email });
    }
    catch {
        res.status(400).send("There is no user from the above details");
    }
    const validPassword = await bcrypt_1.default.compare(password, existingUser.password);
    if (!existingUser || !validPassword) {
        res.status(400).send("Error in identification details");
        return;
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({
            userId: existingUser._id,
            email: existingUser.email,
            userName: existingUser.userName,
        }, process.env.SECRET_KEY, { expiresIn: "1h" });
    }
    catch (err) {
        res.status(400).send("Error! Something went wrong.");
    }
    res.status(200).send({
        success: true,
        data: {
            token: token,
        },
    });
};
exports.CreatJWT = CreatJWT;

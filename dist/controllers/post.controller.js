"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsFromUser = exports.deletePost = exports.updatePost = exports.getPortById = exports.createPost = exports.getAllPosts = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../util/database");
//Get all posts + User name instead of id / Get search title
const getAllPosts = async (req, res) => {
    let search = req.query.search;
    //console.log(search);
    if (!search) {
        const posts = await database_1.collectionsDB.posts
            ?.aggregate([
            {
                $lookup: {
                    from: "Users",
                    localField: "user",
                    foreignField: "_id",
                    pipeline: [{ $project: { name: 1, _id: 0 } }],
                    as: "userName",
                },
            },
            {
                $unwind: "$userName",
            },
        ])
            .toArray();
        const finalPost = posts?.map((post) => {
            const prop = {
                ...post,
                user: post.userName.name,
            };
            const { userName, ...rest } = prop;
            return rest;
        });
        res.status(200).send(finalPost);
        return;
    }
    const posts = await database_1.collectionsDB.posts
        ?.find({ title: { $regex: "^" + search } })
        .toArray();
    if (posts) {
        res.status(200).send(posts);
    }
};
exports.getAllPosts = getAllPosts;
//creat new post
const createPost = async (req, res) => {
    const post = req.body;
    if (!post) {
        res.status(400).send("Post is undefined");
        return;
    }
    const result = await database_1.collectionsDB.posts?.insertOne({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    if (!result) {
        res.status(500).send("Not create post 👎");
        return;
    }
    res.status(201).send("Post created successfully 👍");
};
exports.createPost = createPost;
//Get post by Id
const getPortById = async (req, res) => {
    const id = req.params;
    if (!id) {
        res.status(400).send("IdPost is undefined");
        return;
    }
    try {
        const idPost = { _id: new mongodb_1.ObjectId(id) };
        const post = (await database_1.collectionsDB.posts?.findOne(idPost));
        if (post) {
            res.status(200).send(post);
        }
    }
    catch (error) {
        res.status(404).send(`Can not find post with id: ${req.params.id}`);
    }
};
exports.getPortById = getPortById;
//Update port
const updatePost = async (req, res) => {
    const id = req.params;
    const post = req.body;
    if (!id || !post) {
        res.status(400).send("Post/Id is undefined");
        return;
    }
    const idPost = { _id: new mongodb_1.ObjectId(id) };
    const result = await database_1.collectionsDB.posts?.updateOne(idPost, {
        $set: { ...post, updatedAt: new Date() },
    });
    if (!result) {
        res.status(500).send("Not update post 👎");
        return;
    }
    res.status(200).send("Post update successfully 👍");
};
exports.updatePost = updatePost;
//Delete post
const deletePost = async (req, res) => {
    const id = req.params;
    if (!id) {
        res.status(400).send("IdPost is undefined");
        return;
    }
    const idPost = { _id: new mongodb_1.ObjectId(id) };
    const result = await database_1.collectionsDB.posts?.deleteOne(idPost);
    if (!result) {
        res.status(500).send("Not delete post 👎");
        return;
    }
    res.status(200).send("Post delete successfully 👍");
};
exports.deletePost = deletePost;
//Get post from one user by id user
const getPostsFromUser = async (req, res) => {
    const id = req.params;
    if (!id) {
        res.status(400).send("IdPost is undefined");
        return;
    }
    try {
        const idUser = { user: new mongodb_1.ObjectId(id) };
        const posts = await database_1.collectionsDB.posts?.find(idUser).toArray();
        if (posts) {
            res.status(200).send(posts);
        }
    }
    catch (error) {
        res
            .status(404)
            .send(`Can not find post from this user, Id: ${req.params.id}`);
    }
};
exports.getPostsFromUser = getPostsFromUser;

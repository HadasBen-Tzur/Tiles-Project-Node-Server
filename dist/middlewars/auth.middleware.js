"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMiddlewareJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getMiddlewareJWT = async (req, res, next) => {
    console.log("In Aute Middelware");
    try {
        let token = req.headers.authorization;
        // verify request has token
        if (!token) {
            return res.status(401).send({ message: "Invalid token" });
        }
        // remove Bearer if using Bearer Authorization mechanism
        token = token.split(" ")[1];
        console.log(token);
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        next();
    }
    catch (error) {
        if (error === "TokenExpiredError") {
            res.status(401).send({ message: "Expired token" });
            return;
        }
        res.status(500).send({ message: "Failed to authenticate user" });
    }
};
exports.getMiddlewareJWT = getMiddlewareJWT;

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const getMiddlewareJWT: RequestHandler = async (req, res, next) => {
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
    jwt.verify(token, process.env.SECRET_KEY!);
    next();
  } catch (error) {
    if (error === "TokenExpiredError") {
      res.status(401).send({ message: "Expired token" });
      return;
    }
    res.status(500).send({ message: "Failed to authenticate user" });
  }
};

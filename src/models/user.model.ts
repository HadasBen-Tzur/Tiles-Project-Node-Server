import { ObjectId } from "mongodb";

export enum Roles {
  Admin = "Admin",
  Moderator = "Moderator",
  Editor = "Editor",
  Viewer = "Viewer",
}

export interface User {
  _id?: ObjectId;
  userName: string;
  email: string;
  password: string;
  role: Roles;
}

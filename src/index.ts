import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import { tileRout } from "./routes/tile.route";
import { userRout } from "./routes/user.route";
import { connectToDB } from "./util/database";

dotenv.config();

const app: Express = express();

const corsOptions = { origin: "http://localhost:5173", credentials: true };
app.use(cors(corsOptions));

const port = process.env.PORT;
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my project!");
});

app.use("/user", userRout);
app.use("/tile", tileRout);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(`Error send: ${err}`);
});

connectToDB()
  .then(() => {
    console.log("Welcome... DataBase connected 👌");
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database isn't connected", error);
    //process.exit();
  });



"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const tile_route_1 = require("./routes/tile.route");
const user_route_1 = require("./routes/user.route");
const database_1 = require("./util/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = { origin: "http://localhost:5173", credentials: true };
app.use((0, cors_1.default)(corsOptions));
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.get("/", (req, res) => {
    res.send("Welcome to my project!");
});
app.use("/user", user_route_1.userRout);
app.use("/tile", tile_route_1.tileRout);
app.use((err, req, res, next) => {
    res.status(500).send(`Error send: ${err}`);
});
(0, database_1.connectToDB)()
    .then(() => {
    console.log("Welcome... DataBase connected 👌");
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error("Database isn't connected", error);
    //process.exit();
});

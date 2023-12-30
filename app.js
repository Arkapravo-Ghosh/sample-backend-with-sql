import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import connectDB from "./config/dbconfig.js";

import indexRouter from "./routes/index.js";
import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import verifyRouter from "./routes/verify.js";

const app = express();
app.use(process.env.PRODUCTION ? logger('combined') : logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("public")));

connectDB();

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/verify", verifyRouter);

const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Server listening on port " + port);
});

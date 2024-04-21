import mongoose from "mongoose";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import express from "express";
import cors from "cors";
import phoneBooksRouter from "./controllers/phonebooks.js";
import middleware from "./utils/middleware.js";
import morgan from "morgan";
import infoRouter from "./controllers/info.js";

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("conected to mongodb");
  })
  .catch((error) => {
    logger.info("failed to connect :" + error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json())
app.use("/", infoRouter)
app.use("/api/persons", phoneBooksRouter)
app.use(morgan(":method :url :response-time ms - :res[content-length] :body"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app;

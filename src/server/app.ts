import cors from "cors";
import morgan from "morgan";
import express from "express";
import routes from "./routes/routes.js";
import productsRouter from "./routers/productsRouter/productsRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(routes.productsRouter, cors(), productsRouter);

export default app;

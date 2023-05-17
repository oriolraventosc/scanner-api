import cors from "cors";
import morgan from "morgan";
import express from "express";
import routes from "./routes/routes.js";
import productsRouter from "./routers/productsRouter/productsRouter.js";
import generalError from "./middlewares/error/error.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(routes.productsRouter, cors(), productsRouter);

app.use(routes.usersRouter, cors(), usersRouter);

export default app;

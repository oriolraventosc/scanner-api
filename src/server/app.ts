import morgan from "morgan";
import express from "express";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

export default app;

import express from "express";
import { loadProduct } from "../../controllers/productsController/productsController.js";
import routes from "../../routes/routes.js";

// eslint-disable-next-line new-cap
const productsRouter = express.Router();

productsRouter.get(routes.loadProduct, loadProduct);

export default productsRouter;

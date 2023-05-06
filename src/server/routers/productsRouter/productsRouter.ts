import express from "express";
import {
  loadProduct,
  scanProduct,
  searchBar,
} from "../../controllers/productsController/productsController.js";
import routes from "../../routes/routes.js";

// eslint-disable-next-line new-cap
const productsRouter = express.Router();

productsRouter.get(routes.scanProduct, scanProduct);

productsRouter.get(routes.search, searchBar);
productsRouter.get(routes.loadProduct, loadProduct);

export default productsRouter;

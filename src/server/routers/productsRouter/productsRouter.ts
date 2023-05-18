import express from "express";
import {
  loadFavouriteProducts,
  loadProduct,
  scanProduct,
  searchBar,
} from "../../controllers/productsController/productsController.js";
import routes from "../../routes/routes.js";
import auth from "../../middlewares/Auth.js";

// eslint-disable-next-line new-cap
const productsRouter = express.Router();

productsRouter.get(routes.scanProduct, scanProduct);

productsRouter.get(routes.search, searchBar);
productsRouter.get(routes.loadProduct, loadProduct);
productsRouter.get(routes.favouriteProducts, auth, loadFavouriteProducts);

export default productsRouter;

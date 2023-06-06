import express from "express";
import {
  addToFavourites,
  deleteFavouriteProduct,
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
productsRouter.patch(routes.addToFavourites, auth, addToFavourites);
productsRouter.patch(routes.deleteFromFavourites, auth, deleteFavouriteProduct);

export default productsRouter;

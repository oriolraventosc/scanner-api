const routes = {
  productsRouter: "/product",
  loadProduct: "/:name",
  scanProduct: "/scan",
  search: "/search",
  login: "/login",
  register: "/register",
  usersRouter: "/user",
  favouriteProducts: "/favourite-products/:email",
  addToFavourites: "/add-to-favourites/:email/:product",
  deleteFromFavourites: "/delete-from-favourites/:email/:productEan",
};

export default routes;

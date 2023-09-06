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
  status: "/status-products-search",
  loadUser: "/load-user/:email",
  updateUser: "/update-user/:email",
};

export default routes;

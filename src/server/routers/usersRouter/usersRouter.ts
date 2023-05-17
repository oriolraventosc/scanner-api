import express from "express";

import routes from "../../routes/routes.js";
import {
  login,
  register,
} from "../../controllers/usersController/usersController.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(routes.login, login);
usersRouter.post(routes.register, register);

export default usersRouter;
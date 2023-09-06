import type { Request, Response, NextFunction } from "express";
import debugCreator from "debug";
import enviroment from "../../../loadEnviroment.js";
import CustomError from "../../customError/customError.js";
import type { UserStructure, UserTokenPayload } from "../../../types/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../../database/models/user/user.js";

const debug = debugCreator(`${enviroment.debug}users controller`);

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as UserStructure;
  if (!email || !password) {
    const customError = new CustomError(
      "Missing credentials",
      401,
      "Missing credentials"
    );
    next(customError);
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      email,
    };
    const accessToken = jwt.sign(tokenPayload, enviroment.secretKey, {
      expiresIn: "3d",
    });
    res.status(200).json({
      accessToken,
      id: user._id.toString(),
      name: user.name,
      favouriteProducts: user.favouriteProducts,
      email: user.email,
    });
  } catch {
    const error = new CustomError(
      "An error ocurred while logging in!",
      500,
      "An error ocurred while logging in!"
    );
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body as UserStructure;
  try {
    if (!email || !password || !name) {
      const error = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      next(error);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      favouriteProducts: [],
    });

    res.status(201).json({ newUser });
  } catch {
    const error = new CustomError(
      "We couldn't create the user!",
      500,
      "We couldn't create the user!"
    );
    next(error);
  }
};

export const loadUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      debug("No user found!");
      res.status(400).json({ error: "Error! No user found..." });
    }

    res.status(200).json({ user });
  } catch {
    const error = new CustomError("No user found!", 500, "No user found!");
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email: findUserEmail } = req.params;
  const { email, name, password } = req.body as UserStructure;
  try {
    const user = await User.findOne({ email: findUserEmail });
    if (!user) {
      debug("No user found!");
      res.status(400).json({ error: "Error! No user found..." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = {
      email,
      password: hashedPassword,
      name,
      favouriteProducts: user.favouriteProducts,
    };

    await User.findOneAndUpdate({ email }, { ...updatedUser });
    res.status(200).json({ updatedUser });
  } catch {
    const error = new CustomError(
      "Error updating user information!",
      500,
      "Error updating user information"
    );
    next(error);
  }
};

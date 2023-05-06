import type { Request, Response, NextFunction } from "express";
import Product from "../../../database/models/product/product.js";
import { ProductStructure } from "../../../types/types";
import debugCreator from "debug";
import enviroment from "../../../loadEnviroment.js";
import generalError from "../../middlewares/error/error.js";
import CustomError from "../../customError/customError.js";

const debug = debugCreator(`${enviroment.debug}productsController`);

export const scanProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;
  try {
    const productInformation = await Product.findOne({ ean: id });
    if (!productInformation) {
      res.status(204).json({
        product: {},
        favouriteProducts: [],
      });
    }

    res.status(200).json({
      productInformation,
    });
    debug(`${productInformation.name} found!`);
  } catch {
    const error = new CustomError(
      "An error ocurred scanning...",
      500,
      "An error ocurred scanning..."
    );
    next(error);
  }
};

export const searchBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.query;
  try {
    const products = await Product.find({
      name,
    });
    if (!products) {
      res.status(200).json({
        productInformation: [],
        productsList: [],
      });
      debug(`0 products found!`);
      return;
    }

    res.status(200).json({
      productsList: products,
      productInformation: [],
    });
  } catch {
    const error = new CustomError(
      "An error ocurred searching...",
      500,
      "An error ocurred searching..."
    );
    next(error);
  }
};

export const loadProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.params;
  try {
    const product = await Product.findOne({ name });
    if (!product) {
      res.status(200).json({
        productInformation: [],
        productsList: [],
      });
      debug(`0 products found!`);
    }

    res.status(200).json({
      productsList: [],
      productInformation: product,
    });
  } catch {
    const error = new CustomError(
      "An error ocurred loading product...",
      500,
      "An error ocurred loading product..."
    );
    next(error);
  }
};

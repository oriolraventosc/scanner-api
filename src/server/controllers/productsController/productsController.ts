import type { Request, Response, NextFunction } from "express";
import Product from "../../../database/models/product/product.js";
import { ProductStructure } from "../../../types/types";
import debugCreator from "debug";
import enviroment from "../../../loadEnviroment.js";
import generalError from "../../middlewares/error/error.js";
import CustomError from "../../customError/customError.js";

const debug = debugCreator(`${enviroment.debug}productsController`);

export const loadProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
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

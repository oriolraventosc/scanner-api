import type { Request, Response, NextFunction } from "express";
import Product from "../../../database/models/product/product.js";
import type { ProductStructure } from "../../../types/types";
import debugCreator from "debug";
import enviroment from "../../../loadEnviroment.js";
import CustomError from "../../customError/customError.js";
import User from "../../../database/models/user/user.js";
import ScanProduct from "../../../database/models/scanProduct/scanProduct.js";
import Keyword from "../../../database/models/keywords/keywords.js";

const debug = debugCreator(`${enviroment.debug}productsController`);

interface FavouriteProductBody {
  favouriteProduct: ProductStructure;
}

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
  const { name, limit } = req.query;
  const limitNumber = limit || 10;
  try {
    const products = await Product.find({
      name,
    });
    const scanProducts = await ScanProduct.find({ name });
    const resultProducts = [...products, ...scanProducts];
    if (!products && !scanProducts) {
      res.status(200).json({
        productInformation: [],
        productsList: [],
      });
      debug(`0 products found!`);
      return;
    }

    res.status(200).json({
      productsList: resultProducts.slice(0, Number(limitNumber)),
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
      const scanProduct = await ScanProduct.findOne({ name });
      if (!scanProduct) {
        debug(`0 products found!`);
      }

      for (const keyword of scanProduct.keywords) {
        // eslint-disable-next-line no-await-in-loop
        const keywordItem = await Keyword.findOne({ name: keyword });

        if (keywordItem) {
          const alreadyExists = scanProduct.keywordsWithDescription.some(
            (item) => item.name.toString() === keywordItem.name.toString()
          );

          // eslint-disable-next-line max-depth
          if (!alreadyExists) {
            scanProduct.keywordsWithDescription.push(keywordItem);
          }
        }
      }

      res.status(200).json({
        productsList: [],
        productInformation: scanProduct,
      });
    }

    for (const keyword of product.keywords) {
      // eslint-disable-next-line no-await-in-loop
      const keywordItem = await Keyword.findOne({ name: keyword });

      if (keywordItem) {
        const alreadyExists = product.keywordsWithDescription.some(
          (item) => item.name.toString() === keywordItem.name.toString()
        );

        if (!alreadyExists) {
          product.keywordsWithDescription.push(keywordItem);
        }
      }
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

export const loadFavouriteProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;
  const { limit } = req.query;
  const limitNumber = limit || 10;

  try {
    const user = await User.findOne({ email });
    const { favouriteProducts, name, password } = user;
    if (user.favouriteProducts.length === 0) {
      res.status(204).json({
        user,
      });
    }

    res.status(200).json({
      user: {
        name,
        password,
        email,
        favouriteProducts: favouriteProducts.slice(0, Number(limitNumber)),
      },
    });
  } catch {
    const error = new CustomError(
      "An error ocurred loading favourite products...",
      500,
      "An error ocurred loading favourite products..."
    );
    next(error);
  }
};

export const addToFavourites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, product } = req.params;
  try {
    const user = await User.findOne({ email });
    const productToAdd = await Product.findOne({ ean: product });
    // eslint-disable-next-line no-negated-condition
    if (!productToAdd) {
      const scanProduct = await ScanProduct.findOne({ ean: product });
      if (!scanProduct) {
        debug(`0 products found!`);
      }

      const updatedUserInfo = {
        email: user.email,
        name: user.name,
        password: user.password,
        favouriteProducts: [...user.favouriteProducts, scanProduct],
      };

      await User.findOneAndUpdate({ email }, { ...updatedUserInfo });
      res.status(200).json({
        updatedUserInfo,
      });
    } else {
      const updatedUser = {
        email: user.email,
        name: user.name,
        password: user.password,
        favouriteProducts: [...user.favouriteProducts, productToAdd],
      };
      await User.findOneAndUpdate({ email }, { ...updatedUser });
      res.status(200).json({
        updatedUser,
      });
    }
  } catch {
    const error = new CustomError(
      "We could not add the product to favourites",
      500,
      "We could not add the product to favourites"
    );
    next(error);
  }
};

export const deleteFavouriteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, productEan } = req.params;
  try {
    const user = await User.findOne({ email });
    const { favouriteProducts } = user;
    const updatedFavouriteProducts = favouriteProducts.filter(
      (product) => product.ean !== productEan
    );
    const updatedUser = {
      email: user.email,
      name: user.name,
      password: user.password,
      favouriteProducts: updatedFavouriteProducts,
    };
    await User.findOneAndUpdate({ email }, { ...updatedUser });
    res.status(200).json({
      updatedUser,
    });
  } catch {
    const error = new CustomError(
      "We could not delete the product from favourites",
      500,
      "We could not delete the product from favourites"
    );
    next(error);
  }
};

export const searchProductsByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { limit, status } = req.query;
  const limitNumber = limit || 10;
  try {
    const scanProducts = await ScanProduct.find({ status });
    const products = await Product.find({ status });
    if (products.length === 0 && scanProducts.length === 0) {
      res.status(200).json({
        scanProducts: [],
        products: [],
      });
    }

    if (products.length === 0 && scanProducts.length > 0) {
      res.status(200).json({
        products: [],
        scanProducts: scanProducts.slice(0, Number(limitNumber)),
      });
    }

    if (products.length > 0 && scanProducts.length === 0) {
      res.status(200).json({
        scanProducts: [],
        products: products.slice(0, Number(limitNumber)),
      });
    }

    if (products.length > 0 && scanProducts.length > 0) {
      res.status(200).json({
        scanProducts: scanProducts.splice(0, Number(limitNumber)),
        products: products.slice(0, Number(limitNumber)),
      });
    }
  } catch {
    const error = new CustomError(
      "We could not find any product and supplement",
      500,
      "We could not find any product and supplement"
    );
    next(error);
  }
};

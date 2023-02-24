import type { Request, Response, NextFunction } from "express";
import Product from "../../../database/models/product/product.js";
import { ProductStructure } from "../../../types/types";
import debugCreator from "debug";
import enviroment from "../../../loadEnviroment.js";
import chalk from "chalk";

const debug = debugCreator(`${enviroment.debug}productsController`);

export const loadProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { brand } = req.query;
  try {
    if (brand === "Mercadona") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Condis",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Dia",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Alcampo",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Carrefour",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Eroski",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "El Corte Inglés",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }

    if (brand === "Condis") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Mercadona",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Dia",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Alcampo",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Carrefour",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Eroski",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "El Corte Inglés",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }

    if (brand === "Dia") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Condis",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Mercadona",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Alcampo",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Carrefour",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Eroski",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "El Corte Inglés",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }

    if (brand === "Alcampo") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Condis",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Dia",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Mercadona",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Carrefour",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Eroski",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "El Corte Inglés",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }

    if (brand === "Carrefour") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Condis",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Dia",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Alcampo",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Mercadona",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Eroski",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "El Corte Inglés",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }

    if (brand === "Eroski") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Condis",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Dia",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Alcampo",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Carrefour",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Mercadona",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "El Corte Inglés",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }

    if (brand === "El Corte Inglés") {
      const productInformation = await Product.findOne({ ean: id, brand });
      const relatedProduct1 = await Product.findOne({
        ean: id,
        brand: "Condis",
      });
      const relatedProduct2 = await Product.findOne({
        ean: id,
        brand: "Dia",
      });
      const relatedProduct3 = await Product.findOne({
        ean: id,
        brand: "Alcampo",
      });
      const relatedProduct4 = await Product.findOne({
        ean: id,
        brand: "Carrefour",
      });
      const relatedProduct5 = await Product.findOne({
        ean: id,
        brand: "Eroski",
      });
      const relatedProduct6 = await Product.findOne({
        ean: id,
        brand: "Mercadona",
      });
      res.status(200).json({
        productInformation,
        relatedProduct1,
        relatedProduct2,
        relatedProduct3,
        relatedProduct4,
        relatedProduct5,
        relatedProduct6,
      });
      debug(chalk.greenBright(`${productInformation.name} found!`));
    }
  } catch {}
};

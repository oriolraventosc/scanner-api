import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  loadProduct,
  scanProduct,
  searchBar,
  loadFavouriteProducts,
} from "./productsController";
import Product from "../../../database/models/product/product";
import CustomError from "../../customError/customError";
import { productMock } from "../../../mocks/productMock/productMock";
import connectToDatabase from "../../../database";
import User from "../../../database/models/user/user";
import { userMock } from "../../../mocks/usersMock/usersMock";

let server: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

beforeEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const next = jest.fn();
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a productsController", () => {
  jest.setTimeout(25000);
  describe("When scanProduct is invoked with 1 product", () => {
    test("Then it should return an object with a product property value 'Tomato sauce'", async () => {
      const status = 200;
      const req: Partial<Request> = { query: { id: "12345678900" } };
      Product.find = jest.fn().mockReturnValue(productMock);
      await scanProduct(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When scanProduct is invoked with no product", () => {
    test("Then it should return a 204 status", async () => {
      const status = 204;
      const req: Partial<Request> = { query: { id: "12345678900" } };

      Product.find = jest
        .fn()
        .mockReturnValue({ product: {}, favouriteProducts: [] });
      await scanProduct(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When scanProduct is invoked and an error happens", () => {
    test("Then it should return an error", async () => {
      const error = new CustomError(
        "An error ocurred scanning...",
        500,
        "An error ocurred scanning..."
      );
      const req: Partial<Request> = { query: { id: "12345678900" } };

      Product.find = jest.fn().mockRejectedValue(error);
      await scanProduct(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    }, 10000);
  });

  describe("When searchProduct is invoked with 1 product", () => {
    test("Then it should return an object", async () => {
      const status = 200;
      const req: Partial<Request> = { query: { name: "product" } };
      Product.find = jest.fn().mockReturnValue(productMock);
      await searchBar(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When searchProduct is invoked with no product", () => {
    test("Then it should return a 204 status", async () => {
      const status = 204;
      const req: Partial<Request> = { query: { name: "product" } };

      Product.find = jest.fn().mockReturnValue(null);
      await searchBar(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When searchProduct is invoked and an error happens", () => {
    test("Then it should return an error", async () => {
      const error = new CustomError(
        "An error ocurred searching...",
        500,
        "An error ocurred searching..."
      );
      const req: Partial<Request> = { query: { name: "product" } };

      Product.find = jest.fn().mockRejectedValue(error);
      await searchBar(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    }, 10000);
  });

  describe("When loadProduct is invoked with 1 product", () => {
    test("Then it should return an object", async () => {
      const status = 200;
      const req: Partial<Request> = { params: { name: "product" } };
      Product.find = jest.fn().mockReturnValue(productMock);
      await loadProduct(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When loadProduct is invoked with no product", () => {
    test("Then it should return a 204 status", async () => {
      const status = 204;
      const req: Partial<Request> = { params: { name: "product" } };

      Product.find = jest
        .fn()
        .mockReturnValue({ productInformation: {}, productsList: [] });
      await loadProduct(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When loadProduct is invoked and an error happens", () => {
    test("Then it should return an error", async () => {
      const error = new CustomError(
        "An error ocurred searching...",
        500,
        "An error ocurred searching..."
      );
      const req: Partial<Request> = { params: { name: "product" } };

      Product.find = jest.fn().mockRejectedValue(error);
      await loadProduct(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    }, 10000);
  });

  describe("When loadFavouriteProducts is invoked with 1 favourite product", () => {
    test("Then it should return a user with 1 favourite product", async () => {
      const status = 200;
      const req: Partial<Request> = {
        params: { email: "user@gmail.com" },
      };

      User.findOne = jest.fn().mockReturnValue(userMock);
      await loadFavouriteProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When loadFavouriteProducts is invoked with 0 favourite products", () => {
    test("Then it should show a user without any favourite product", async () => {
      const status = 204;
      const req: Partial<Request> = {
        params: { email: "user@gmail.com" },
      };

      User.findOne = jest.fn().mockReturnValue(userMock);
      await loadFavouriteProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When loadFavouriteProducts is invoked and an internal server error ocurres", () => {
    test("Then it should call it's next method with an error", async () => {
      const error = new CustomError(
        "An error ocurred loading favourite products...",
        500,
        "An error ocurred loading favourite products..."
      );
      const req: Partial<Request> = {
        params: { email: "user@gmail.com" },
      };

      User.findOne = jest.fn().mockRejectedValue(error);
      await loadFavouriteProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

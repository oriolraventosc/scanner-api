import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { loadProduct } from "./productsController";
import Product from "../../../database/models/product/product";
import CustomError from "../../customError/customError";
import { productMock } from "../../../mocks/productMock/productMock";
import connectToDatabase from "../../../database";

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
  describe("When loadProduct is invoked with 1 product", () => {
    test("Then it should return an object with a product property value 'Tomato sauce'", async () => {
      const status = 200;
      const req: Partial<Request> = { params: { id: "12345678900" } };
      Product.find = jest.fn().mockReturnValue(productMock);
      await loadProduct(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When loadProduct is invoked with no product", () => {
    test("Then it should return a 204 status", async () => {
      const status = 204;
      const req: Partial<Request> = { params: { id: "12345678900" } };

      Product.find = jest
        .fn()
        .mockReturnValue({ product: {}, favouriteProducts: [] });
      await loadProduct(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When loadProduct is invoked and an error happens", () => {
    test("Then it should return an error", async () => {
      const error = new CustomError(
        "An error ocurred scanning...",
        500,
        "An error ocurred scanning..."
      );
      const req: Partial<Request> = { params: { id: "12345678900" } };

      Product.find = jest.fn().mockRejectedValue(error);
      await loadProduct(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});

import type { Request, Response, NextFunction } from "express";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../../database/models/product/product";
import CustomError from "../../customError/customError";
import { productMock } from "../../../mocks/productMock/productMock";
import connectToDatabase from "../../../database";
import app from "../../app";
import routes from "../../routes/routes";

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

describe("Given a GET /loadProduct endpoint", () => {
  describe("When it receives a request with 1 product", () => {
    test("Then it should return an object with a product", async () => {
      const status = 200;
      Product.findOne = jest.fn().mockReturnValue(productMock);
      const response = await request(app)
        .get(`${routes.productsRouter}/12345678900`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
  describe("When it receives a request with 0 product", () => {
    test("Then it should return an object with no product", async () => {
      const status = 204;
      Product.findOne = jest.fn().mockReturnValue(null);
      const response = await request(app)
        .get(`${routes.productsRouter}/12345678900`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
  describe("When it receives a request and an internal server error ocurres", () => {
    test("Then it should return an object with a property climbingWall", async () => {
      const status = 500;
      const error = new CustomError(
        "An error ocurred scanning...",
        500,
        "An error ocurred scanning..."
      );
      Product.findOne = jest.fn().mockRejectedValue(error);

      const response = await request(app)
        .get(`${routes.productsRouter}/12345678900`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
});

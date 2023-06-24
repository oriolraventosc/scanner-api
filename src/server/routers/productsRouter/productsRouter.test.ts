import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import enviroment from "../../../loadEnviroment";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../../database/models/product/product";
import CustomError from "../../customError/customError";
import { productMock } from "../../../mocks/productMock/productMock";
import connectToDatabase from "../../../database";
import app from "../../app";
import routes from "../../routes/routes";
import User from "../../../database/models/user/user";
import { userMock } from "../../../mocks/usersMock/usersMock";
import ScanProduct from "../../../database/models/scanProduct/scanProduct";

const { secretKey } = enviroment;

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

const userId = 12345;

const userToken = jwt.sign(
  { email: "user@gmail.com", id: userId.toString() },
  secretKey
);

describe("Given a GET /scanProduct endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with 1 product", () => {
    test("Then it should return an object with a product", async () => {
      const status = 200;
      Product.findOne = jest.fn().mockReturnValue(productMock);
      const response = await request(app)
        .get(`${routes.productsRouter}/scan?id=product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
  describe("When it receives a request with 0 product", () => {
    test("Then it should return an object with no product", async () => {
      const status = 204;
      Product.findOne = jest.fn().mockReturnValue(null);
      const response = await request(app)
        .get(`${routes.productsRouter}/scan?id=product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
  describe("When it receives a request and an internal server error ocurres", () => {
    test("Then it should return an object with a property error", async () => {
      const status = 500;
      const error = new CustomError(
        "An error ocurred scanning...",
        500,
        "An error ocurred scanning..."
      );
      Product.findOne = jest.fn().mockRejectedValue(error);

      const response = await request(app)
        .get(`${routes.productsRouter}/scan?id=product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
});

describe("Given a GET /search endpoint", () => {
  jest.setTimeout(25000);

  describe("When it receives a request and an internal server error ocurres", () => {
    test("Then it should return an object with a property error", async () => {
      const status = 500;
      const error = new CustomError(
        "An error ocurred searching...",
        500,
        "An error ocurred searching..."
      );
      Product.find = jest.fn().mockRejectedValue(error);

      const response = await request(app)
        .get(`${routes.productsRouter}/search?name=product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
});

describe("Given a GET /:name endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with 1 product", () => {
    test("Then it should return an object with a product", async () => {
      const status = 200;
      Product.findOne = jest.fn().mockReturnValue(productMock);
      const response = await request(app)
        .get(`${routes.productsRouter}/product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });

  describe("When it receives a request with 0 product", () => {
    test("Then it should return an object with a product", async () => {
      const status = 200;
      Product.findOne = jest.fn().mockReturnValue(null);
      const response = await request(app)
        .get(`${routes.productsRouter}/product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });

  describe("When it receives a request and an internal server error ocurres", () => {
    test("Then it should return an object with a property error", async () => {
      const status = 500;
      const error = new CustomError(
        "An error ocurred loading product...",
        500,
        "An error ocurred loading product..."
      );
      Product.findOne = jest.fn().mockRejectedValue(error);

      const response = await request(app)
        .get(`${routes.productsRouter}/product`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
});

describe("Given a GET /favourite-products/:email endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with 0 favourite product", () => {
    test("Then it should return a user with 0 favourite product", async () => {
      const status = 204;
      User.findOne = jest.fn().mockReturnValue(userMock);

      const response = await request(app)
        .get(`${routes.productsRouter}/favourite-products/user@gmail.com`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });

  describe("When it receives a request and an internal server error ocurres", () => {
    test("Then it should return an error", async () => {
      const status = 500;
      const error = new CustomError(
        "An error ocurred loading favourite products...",
        500,
        "An error ocurred loading favourite products..."
      );
      User.findOne = jest.fn().mockRejectedValue(error);

      const response = await request(app)
        .get(`${routes.productsRouter}/favourite-products/user@gmail.com`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
});

describe("Given a GET /status-products-search", () => {
  describe("When it is invoked with 2 products", () => {
    test("Then it should return a 200 stauts code", async () => {
      const status = 200;
      Product.find = jest.fn().mockReturnValue([productMock]);
      ScanProduct.find = jest.fn().mockReturnValue([productMock]);

      const response = await request(app)
        .get(`${routes.productsRouter}/status-products-search`)
        .query({ status: "Healthy" })
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });

  describe("When it is invoked with 2 products and an internal server error ocurres", () => {
    test("Then it should return a 500 status code", async () => {
      const status = 500;
      const error = new CustomError(
        "We could not find any product and supplement",
        500,
        "We could not find any product and supplement"
      );
      Product.find = jest.fn().mockRejectedValue(error);
      ScanProduct.find = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .get(`${routes.productsRouter}/status-products-search`)
        .query({ status: "Healthy" })
        .expect(status);

      expect(response.statusCode).toBe(status);
    });
  });
});

import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import connectToDatabase from "../../../database/index";
import mongoose from "mongoose";
import app from "../../app";
import CustomError from "../../customError/customError";
import User from "../../../database/models/user/user";
import bcrypt from "bcrypt";
import routes from "../../routes/routes";
import type { Request, Response, NextFunction } from "express";
import { register } from "../../controllers/usersController/usersController";

const next = jest.fn();

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

let server: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a POST '/login' endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with a valid user", () => {
    test("Then it should return an object with a property 'accessToken'", async () => {
      const userData = {
        email: "climber@gmail.com",
        password: "climber",
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const registerData = {
        email: "climber@gmail.com",
        password: hashedPassword,
        name: "climber",
      };
      await User.create(registerData);
      const req: Partial<Request> = {
        body: registerData,
      };
      await register(req as Request, res as Response, next as NextFunction);
      const status = 200;
      const response = await request(app)
        .post(`${routes.usersRouter}${routes.login}`)
        .send(userData)
        .expect(status);

      expect(response.body).toHaveProperty("accessToken");
    });

    test("Then it should return an object with a property 'error'", async () => {
      const userdata = {
        email: "user@gmail.com",
        password: "climber",
      };
      const error = new CustomError(
        "An error ocurred while logging in!",
        500,
        "An error ocurred while logging in!"
      );
      const status = 500;
      User.findOne = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .post(`${routes.usersRouter}${routes.login}`)
        .send(userdata)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });
});

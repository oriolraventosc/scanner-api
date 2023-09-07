import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import connectToDatabase from "../../../database/index";
import mongoose from "mongoose";
import app from "../../app";
import CustomError from "../../customError/customError";
import User from "../../../database/models/user/user";
import bcrypt from "bcrypt";
import {
  userMock,
  userWithoutEmailMock,
  userWithoutPasswordMock,
} from "../../../mocks/usersMock/usersMock";
import routes from "../../routes/routes";

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

describe("Given a POST '/register' endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with a valid user data", () => {
    test("Then it should return an object with the properties 'name, email, password'", async () => {
      const status = 201;

      const hashedPassword = await bcrypt.hash(userMock.password, 10);
      User.create = jest
        .fn()
        .mockReturnValue({ ...userMock, password: hashedPassword });
      const response = await request(app)
        .post(`${routes.usersRouter}${routes.register}`)
        .send(userMock)
        .expect(status);

      expect(response.body).toHaveProperty("newUser");
    });
  });

  describe("When it receives a request without a email", () => {
    test("Then it should return an error", async () => {
      const status = 500;
      const error = new CustomError(
        '"email" is not allowed to be empty',
        500,
        '"email" is not allowed to be empty'
      );

      User.create = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .post(`${routes.usersRouter}${routes.register}`)
        .send(userWithoutEmailMock)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });

  describe("When it receives a request without a password", () => {
    test("Then it should return an error", async () => {
      const status = 500;
      const error = new CustomError(
        '"password" is not allowed to be empty',
        500,
        '"password" is not allowed to be empty'
      );

      User.create = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .post(`${routes.usersRouter}${routes.register}`)
        .send(userWithoutPasswordMock)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });

  describe("When it receives a request and an internal server error happens", () => {
    test("Then it should return an error", async () => {
      const status = 500;
      const error = new CustomError(
        "We couldn't create the user!",
        500,
        "We couldn't create the user!"
      );

      User.create = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .post(`${routes.usersRouter}${routes.register}`)
        .send(userMock)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });
});

describe("Given a PATCH 'user-update' endpoint", () => {
  describe("When it receives a request with all the user updated data but an internal server error happens", () => {
    test("Then it should respond with an error", async () => {
      const status = 500;
      const error = new CustomError(
        "Error updating user information!",
        500,
        "Error updating user information"
      );

      User.findOne = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .patch(`${routes.usersRouter}${routes.updateUser}`)
        .send(userMock)
        .expect(status);

      expect(response.status).toBe(500);
    });
  });
});

describe("Given a GET 'load-user' endpoint", () => {
  describe("When it receives a request with the correct user email but an internal server error happens", () => {
    test("Then it should respond with an error", async () => {
      const status = 500;
      const error = new CustomError("No user found!", 500, "No user found!");

      User.findOne = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .get(`${routes.usersRouter}${routes.loadUser}`)
        .send(userMock)
        .expect(status);

      expect(response.status).toBe(500);
    });
  });
});

describe("Given a PATCH 'update-password' endpoint", () => {
  describe("When it receives a request with the correct user email but an internal server error happens", () => {
    test("Then it should respond with an error", async () => {
      const status = 500;
      const error = new CustomError(
        "Error updating user password!",
        500,
        "Error updating user password!"
      );
      User.findOne = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .patch(`${routes.usersRouter}${routes.updatePassword}`)
        .send(userMock)
        .expect(status);

      expect(response.status).toBe(500);
    });
  });
});

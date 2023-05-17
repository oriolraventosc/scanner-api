import type { UserStructure } from "../../types/types";

export const userMock: UserStructure = {
  email: "user@hotmail.com",
  password: "useruser",
  name: "user",
  favouriteProducts: [],
};

export const userWithoutPasswordMock: UserStructure = {
  email: "user@hotmail.com",
  password: "",
  name: "user",
  favouriteProducts: [],
};

export const userWithoutNameMock: UserStructure = {
  email: "user@hotmail.com",
  password: "useruser",
  favouriteProducts: [],
  name: "user",
};

export const userWithoutEmailMock: UserStructure = {
  email: "",
  password: "useruser",
  name: "user",
  favouriteProducts: [],
};

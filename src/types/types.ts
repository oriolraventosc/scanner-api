import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface UserStructure {
  email: string;
  password: string;
  name: string;
  favouriteProducts: ProductStructure[];
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface ProductStructure {
  name: string;
  image: string;
  price: number;
  ingredients: string;
  brand: string;
  weight: number;
  benefits: string[];
  ean: string;
}

export interface CustomRequest extends Request {
  userId: string;
}

export interface Credentials {
  email: string;
  password: string;
}

import enviroment from "../../../loadEnviroment.js";
import debugCreator from "debug";
import type { NextFunction, Request, Response } from "express";
import type CustomError from "../../customError/customError.js";

const debug = debugCreator(`${enviroment.debug}middlewears`);

export const endpointUnknown = (req: Request, res: Response) => {
  res.status(404).json({ message: "Error not found the endpoint" });
};

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(`Error ${error.message}`);
  const status = error.state ?? 500;
  const message = error.customMessage || "Opps...General Error";

  res.status(status).json({ error: message });
  next();
};

export default generalError;

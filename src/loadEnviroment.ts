import dotenv from "dotenv";
dotenv.config();

const enviroment = {
  debug: process.env.debug,
  url: process.env.MONGODB_URL,
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
};

export default enviroment;

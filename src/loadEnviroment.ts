import dotenv from "dotenv";
dotenv.config();

const enviroment = {
  debug: process.env.debug,
  url: process.env.MONGODB_URL,
  port: process.env.PORT,
};

export default enviroment;

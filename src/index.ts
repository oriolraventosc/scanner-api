import connectToDatabase from "./database/index.js";
import enviroment from "./loadEnviroment.js";
import startServer from "./server/index.js";

const { url, port } = enviroment;

await startServer(port);

await connectToDatabase(url);

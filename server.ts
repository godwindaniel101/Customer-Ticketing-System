import app from './src/app'
import config from "config";
import log from "./src/logger";
import connect from "./src/db/connect";
import { AppError } from './src/utils/error';

process.on('uncaughtException', (err: AppError) => {
  log.info(err);
  process.exit(1);
});


connect();
//connect to db

const port = config.get("port") as number;
//get pot
const host = config.get("host") as string;

const server = app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);
  console.log(`Server runing on port ${port} (${host})`);

});
process.on('unhandledRejection', (err: AppError) => {
  log.info(err);
  server.close(() => {
    process.exit(1);
  });
});
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import routes from "./routes";
import {globalError, AppError , } from '../src/utils/error';
import * as rateLimiter from  '../src/middleware/rateLimiter';
const app = express();

//Body parser, reading data from body to req.body
app.use(express.json());

//Helmet helps you secure your Express apps by setting various HTTP headers
//https://helmetjs.github.io/
app.use(helmet());

// sanitizes user-supplied data to prevent MongoDB Operator Injection
// https://www.npmjs.com/package/express-mongo-sanitize
app.use(mongoSanitize());


app.use(express.urlencoded({ extended: false }));

//api entry point

//rate limiter limits the number of calls ade to the valid api route
app.use('/api/v1', rateLimiter.app , routes );

//undefined routes
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on server !` , 404));
  });

app.use(globalError);
//Global Error Handler
export default app;
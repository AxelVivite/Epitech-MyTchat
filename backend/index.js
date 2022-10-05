/* eslint no-console: 0 */ // --> OFF

import express from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as mongoose from 'mongoose';
import 'express-async-errors';

import Errors from './src/errors';
import routers from './src/routers/routers';
import { logger, internalError } from './src/routers/middlewares';
import { WsRegistry } from './src/WsRegistry';

const app = express();
const port = 3000;

// todo: only enable logger in dev env
expressWs(app);
app.use(logger);
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.locals = {
  wsReg: new WsRegistry(),
};

routers.forEach(({ path, router }) => app.use(`/${path}`, router));

app.use('*', (req, res) => {
  res.status(404).json({
    error: Errors.RouteNotFound,
  });
});

// todo: this doesn't seem to be working
app.use(internalError);

// todo: use env variables for db url
mongoose.connect('mongodb://localhost:27017/vueexpress').then(() => {
  console.log('Database is connected');

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}, (err) => {
  throw Error(`Can't connect to the database ${err}`);
});

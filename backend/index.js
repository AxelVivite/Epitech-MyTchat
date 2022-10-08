/* eslint no-console: 0 */ // --> OFF

import express from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as mongoose from 'mongoose';
import 'express-async-errors';
import config from './src/config';

import Errors from './src/errors';
import routers from './src/routers/routers';
import { logger, internalError } from './src/routers/middlewares';
import { WsRegistry } from './src/WsRegistry';

const app = express();
const port = config.serverPort;

expressWs(app);
if (config.env === 'dev' || config.env === 'test') {
  app.use(logger);
}
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

app.use(internalError);

mongoose.connect(config.mongodbUrl).then(() => {
  console.log('Database is connected');

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}, (err) => {
  throw Error(`Can't connect to the database ${err}`);
});

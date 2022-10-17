import { promises as fs } from 'fs';

import swaggerJsdoc from 'swagger-jsdoc';

import {
  MongoId,
  Timestamp,
  Post,
  Room,
  User,
  SigninResult,
} from './src/schemas';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'JS Full Stack Backend',
      version: '1.0.0',
    },
  },
  tags: [
    'login',
    'room',
  ],
  // todo: add servers field
  apis: [
    './src/routers/login.js',
    './src/routers/room.js',
  ],
};

const components = {
  schemas: {
    MongoId,
    Timestamp,
    Post,
    Room,
    User,
    SigninResult,
  },
  securitySchemes: {
    basicAuth: {
      type: 'http',
      scheme: 'basic',
    },
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

const security = [
  {
    basicAuth: [],
    bearerAuth: [],
  },
];

async function main() {
  const spec = await swaggerJsdoc(options);

  spec.components = components;
  spec.security = security;

  const jsonSpec = JSON.stringify(spec, null, 2);
  await fs.writeFile('./doc/swagger-api.json', jsonSpec, { flag: 'w' });
}

main();

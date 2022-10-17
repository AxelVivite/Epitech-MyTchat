import { promises as fs } from 'fs';

import swaggerJsdoc from 'swagger-jsdoc';

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

const MongoId = {
  type: 'string',
  format: 'uuid',
  example: '632999f5bb5e77c72e9bf905',
};

const Timestamp = {
  type: 'string',
  format: 'date-time',
  example: '2017-07-21T17:32:28Z',
};

const Post = {
  type: 'object',
  required: [
    'user',
    'room',
    'content',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    user: MongoId,
    room: MongoId,
    content: {
      type: 'string',
      format: 'string',
      description: 'Content of the post',
    },
    createdAt: Timestamp,
    updatedAt: Timestamp,
  },
};

const components = {
  schemas: {
    MongoId,
    Timestamp,
    Post,
    SigninResult: {
      type: 'object',
      required: [
        'userId',
        'token',
        'expiresIn',
      ],
      properties: {
        userId: MongoId,
        token: {
          type: 'string',
          description: 'JSON Web Token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI5OWEzNTI1ODUzMzY1NTBjYjI2NDkiLCJpYXQiOjE2NjM2NzA4MzcsImV4cCI6MTY2NDUzNDgzN30.J6AOP4OP6ftFA0ahF8_Up29y23qD-gZF_OqKIYwNj7s',
        },
        expiresIn: {
          type: 'string',
          description: 'TTL of the token, format explained at https://github.com/vercel/ms#examples',
          example: '10 days',
        },
      },
    },
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

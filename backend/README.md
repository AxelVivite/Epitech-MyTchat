# Backend-JS-Fullstack

This repository is part of a school project made for Epitech, for the module JavaScript Full Stack Development. This is the backend part of the project. You can find the frontend [here](https://gitlab.com/david-tedesco/frontend-js-fullstack).

Our project is a simple chat web app. The backend is made with [ExpressJS](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) ([Mongoose](https://mongoosejs.com/)) and is made in Javascript (although we may switch to TypeScript in the future). It uses ESlint with the [eslint-config-airbnb-base configuration](https://www.npmjs.com/package/eslint-config-airbnb-base).

**The project is still early in its development, It's design and features may change significantly in the near future.**

## API routes

Details about the routes can be found in doc/swagger.json or online [here](https://app.swaggerhub.com/apis/ALEXISAURIAC_1/JS-Full-Stack/1.0.0).

This documentation was generated from jsdoc using [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc).

## Websocket

This API uses websockets to send notifications to a client about a variety of things.\
You can find more details in ```/doc/Websocket.md```.

## Usage

### Start the server

You will need to have mongodb running on **mongodb://localhost:27017/vueexpress**. It is a temporary url that we use for tests.

To start the server run (with each environment):\
**dev** ```npm run start```\
**test** ```npm run start:test```\
**prod** ```npm run start:prod```


To start the server and restart on file change (not available in prod):\
**dev** ```npm run watch```\
**test** ```npm run watch:test```

In prod mode you will need a ```.env.prod``` file, you can look at ```.env.dev``` and ```.env.test``` for examples.

### ESlint

To run the linter, run:\
```npm run lint```

### Swagger doc

To generate the swagger doc you first need to install the dependencies for the script:
```
cd scripts/gen-swagger
npm i
```

Then you can run the script (from the root of the project):\
```npm run gen-swagger```

### Unit Tests

To run tests:\
```npm run test```

### Migrations

To create a migration:\
```npm run migration:create {MIGRATION_NAME}```

Then go to the ```migrations``` folder to edit your migration file.

To apply a migration run:\
```npm run migration:up```

To unapply a migration run:\
```npm run migration:down```

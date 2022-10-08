import { config } from 'dotenv';

config({ path: `./.env.${process.env.NODE_ENV}` });

export default {
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES,
  pwdHashSalt: Number.parseInt(process.env.PWD_HASH_SALT, 10),
  mongodbUrl: process.env.MONGODB_URL,
  serverPort: Number.parseInt(process.env.SERVER_PORT, 10),
};

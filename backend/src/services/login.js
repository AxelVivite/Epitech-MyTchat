import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Errors from '../errors';
import { checkToken, checkUserExists, getUser } from './middlewares';
import User from '../models/user';

async function register(email, password) {
  const userExists = await User.findOne({ email });

  if (userExists !== null) {
    return {
      error: Errors.Registration.EmailTaken,
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    passwordHash,
  });

  await user.save();

  const token = jwt.sign(
    { userId: user._id.toString() },
    SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );

  return {
    userId: user._id.toString(),
    token,
    expiresIn: TOKEN_EXPIRES_IN,
  };
}

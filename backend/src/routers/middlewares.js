import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import chalk from 'chalk'

import Errors from '../errors.js'
import User from '../models/user.js'

// todo: use better secret + put in .env file
const SECRET = 'secret'

export const logger = morgan(`[:user-agent] ${chalk.green(':method')} ${chalk.red(':url')} ${chalk.blue(':status')} - :date`)

export function checkToken(req, res, next) {
  const auth = req.headers["Authorization"] || req.headers["authorization"]

  if (auth === undefined) {
    return res.status(400).json({
      error: Errors.Login.MissingToken
    })
  }

  const authMatch = auth.match(/^([Bb]earer|[Tt]oken) (?<token>.+)$/)

  if (authMatch === null) {
    return res.status(400).json({
      errors: Errors.Login.BadAuthType
    })
  }

  const token = authMatch.groups.token
  let userId

  try {
    userId = jwt.verify(token, SECRET).userId
  } catch (e) {
    return res.status(400).json({
      error: Errors.Login.BadToken
    })
  }

  req.state = {...req.state, userId}
  next()
}

export async function getUser(req, res, next) {
  const user = await User.findById(req.state.userId)

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  req.state = {...req.state, user}
  next()
}

export function checkUserExists(req, res, next) {
  if (!(User.exists({ _id: req.state.userId }))) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  next()
}

export function internalError(err, req, res, next) {
  console.error(err)

  res.status(500).json({
    error: Errors.InternalError
  })
}

const jwt = require('jsonwebtoken')

const Errors = require('../errors')
const User = require('../models/user')

// todo: use better secret + put in .env file
const SECRET = 'secret'

module.exports.checkToken = function checkToken(req, res, next) {
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

module.exports.getUser = async function getUser(req, res, next) {
  const user = await User.findById(req.state.userId)

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  req.state = {...req.state, user}
  next()
}

module.exports.checkUserExists = function checkUserExists(req, res, next) {
  if (!(User.exists({ _id: req.state.userId }))) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  next()
}

module.exports.internalError = function internalError(err, req, res, next) {
  console.error(err)

  res.status(500).json({
    error: Errors.InternalError
  })
}

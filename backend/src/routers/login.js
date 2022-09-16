const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Errors = require('../errors')
const { checkToken, checkUserExists, getUser } = require('./middlewares')
const User = require('../models/user')

// todo: use better secret + put in .env file
const SECRET = 'secret'
// Format for describing time: https://github.com/vercel/ms#examples
const TOKEN_EXPIRES_IN = '10 days'

let userCounter = 0
const users = {}

const loginRouter = express.Router()

loginRouter.get('/users', (req, res) => {
  res.status(200).json(Object.values(users).map(({id}) => id))
})

loginRouter.get('/info', [checkToken, getUser], async (req, res) => {
  return res.status(200).json({
    user: {
      username: req.state.user.username,
      email: req.state.user.email,
    }
  })
})

loginRouter.get('/signin/:username', async (req, res) => {
  // todo: check username
  const username = req.params.username
  const user = await User.findOne({ username })

  if (user === null) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  const auth = req.headers["Authorization"] || req.headers["authorization"]

  if (auth === undefined) {
    return res.status(400).json({
      error: Errors.Login.MissingToken
    })
  }

  const authMatch = auth.match(/^Basic (?<password>.+)$/)

  if (authMatch === null) {
    return res.status(400).json({
      errors: Errors.Login.BadAuthType
    })
  }

  const password = authMatch.groups.password
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return res.status(401).json({
      error: InvalidPassword
    })
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    SECRET,
    { expiresIn: TOKEN_EXPIRES_IN })

  res.status(200).json({
    token,
    expiresIn: TOKEN_EXPIRES_IN
  })
})

loginRouter.post('/register', async (req, res) => {
  // todo: check username
  const username = req.body.username
  // todo: check email
  const email = req.body.email

  let userExists = await User.findOne({
    username
  })

 if (userExists !== null) {
    return res.status(409).json({
      error: Errors.Registration.UsernameTaken
    })
  }

  userExists = await User.findOne({
    email
  })

  if (userExists !== null) {
    return res.status(409).json({
      error: Errors.Registration.EmailTaken
    })
  }

  // todo: check password
  const password = req.body.password
  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    email,
    passwordHash
  })

  await user.save()

  const token = jwt.sign(
    { userId: user._id.toString() },
    SECRET,
    { expiresIn: TOKEN_EXPIRES_IN })

  res.status(200).json({
    token,
    expiresIn: TOKEN_EXPIRES_IN
  })
})

loginRouter.delete('/delete', [checkToken, checkUserExists], (req, res) => {
  User.findByIdAndRemove(req.state.userId)

  res.status(201).send()
})

module.exports = loginRouter

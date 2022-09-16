const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Errors = require('../errors')

// todo: use better secret + put in .env file
const SECRET = 'secret'

let userCounter = 0
const users = {}

const loginRouter = express.Router()

loginRouter.get('/users', (req, res) => {
  res.status(200).json(Object.values(users).map(({id}) => id))
})

const TOKEN_EXPIRES_IN = '10 days'

function checkToken(req, res, next) {
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
    // todo: check token is not outdated
    userId = jwt.verify(token, SECRET).userId
  } catch (e) {
    return res.status(400).json({
      error: Errors.Login.BadToken
    })
  }

  req.state = {...req.state, userId}
  next()
}

function getUser(req, res, next) {
  // todo: get from db
  const user = users[req.state.userId]

  if (user === undefined) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  req.state = {...req.state, user}
  next()
}

function checkUserExists(req, res, next) {
  // todo: check in db
  if (!(req.state.userId in users)) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  next()
}

loginRouter.get('/info', [checkToken, getUser], async (req, res) => {
  return res.status(200).json(req.state.user)
})

loginRouter.get('/signin/:username', async (req, res) => {
  // todo: check username
  const username = req.params.username
  // todo: get user from db
  const user = Object.values(users).find(({username: username2}) => username === username2)

  if (user === undefined) {
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
    { userId: user.id },
    // use .env file wiath process.env.SECRET,
    SECRET,
    // Format for describing time: https://github.com/vercel/ms#examples
    { expiresIn: TOKEN_EXPIRES_IN })

  res.status(200).json({
    token
  })
})

loginRouter.post('/register', async (req, res) => {
  // todo: check username
  const username = req.body.username
  // todo: check email (including if it is a valid email)
  const email = req.body.email

  // todo: get users from db
  for (let user of Object.values(users)) {
    if (username === user.username) {
      return res.status(409).json({
        error: Errors.Registration.UsernameTaken
      })
    } else if (email === user.email) {
      return res.status(409).json({
        error: Errors.Registration.EmailTaken
      })
    }
  }

  // check password
  const password = req.body.password
  const passwordHash = await bcrypt.hash(password, 10)

  const user = {
    // todo: use better id
    id: userCounter,
    username,
    email,
    passwordHash
  }

  // add in db
  users[user.id] = user

  userCounter += 1

  // create jwt
  const token = jwt.sign({
    userId: user.id
  },
  // use .env file wiath process.env.SECRET,
  SECRET,
  {
    expiresIn: TOKEN_EXPIRES_IN
    // Format for describing time: https://github.com/vercel/ms#examples
  })

  res.status(200).json({
    token
  })
})

loginRouter.delete('/delete', [checkToken, checkUserExists], (req, res) => {
  // delete user in db
  delete users[req.state.userId]

  res.status(201).send()
})

module.exports = loginRouter

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

module.exports.getUser = function getUser(req, res, next) {
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

module.exports.checkUserExists = function checkUserExists(req, res, next) {
  // todo: check in db
  if (!(req.state.userId in users)) {
    return res.status(404).json({
      error: Errors.Login.AccountNotFound
    })
  }

  next()
}

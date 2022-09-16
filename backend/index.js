const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')

const Errors = require('./src/errors')
const routers = require('./src/routers/routers')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

for (const {path, router} of routers)
  app.use('/' + path, router)

app.get('*', (req, res) => {
  res.status(404).json({
    error: Errors.RouteNotFound
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
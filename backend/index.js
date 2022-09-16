const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')
require('express-async-errors');

const Errors = require('./src/errors')
const routers = require('./src/routers/routers')
const { internalError } = require('./src/routers/middlewares')

const app = express()
const port = 3000

app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

for (const {path, router} of routers)
  app.use('/' + path, router)

app.get('*', (req, res) => {
  res.status(404).json({
    error: Errors.RouteNotFound
  })
})

app.use(internalError)

const connection = mongoose.connect('mongodb://localhost:27017/vueexpress').then(() => {
  console.log('Database is connected')

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}, err => {
  throw Error('Can\'t connect to the database' + err)
})

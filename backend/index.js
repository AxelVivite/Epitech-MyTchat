import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import * as mongoose from 'mongoose'
import 'express-async-errors'

import Errors from './src/errors.js'
import routers from './src/routers/routers.js'
import { logger, internalError } from './src/routers/middlewares.js'

const app = express()
const port = 3000

// todo: only enable logger in dev env
app.use(logger)
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
// todo: add logger middleware

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

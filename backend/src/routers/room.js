const express = require('express')

const Errors = require('../errors')

let roomCounter = 0
const rooms = {}

const roomRouter = express.Router()

roomRouter.get('/rooms', (req, res) => {
  res.status(200).json(Object.values(rooms).map(({id}) => id))
})

roomRouter.post('/create', (req, res) => {
  res.status(200)
})

roomRouter.delete('/delete', (req, res) => {
  res.status(200)
})

roomRouter.get('/websocket', (req, res) => {
  res.status(200)
})

roomRouter.post('/post', (req, res) => {
  res.status(200)
})

roomRouter.get('/read', (req, res) => {
  res.status(200)
})

module.exports = roomRouter

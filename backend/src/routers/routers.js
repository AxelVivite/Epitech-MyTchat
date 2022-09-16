const loginRouter = require('./login')
const roomRouter = require('./room')

// todo: better params/headers/body error handling
// https://joi.dev/api/?v=17.6.0

module.exports = [
	{
		path: 'login',
		router: loginRouter
	},
	{
		path: 'room',
		router: roomRouter
	}
]

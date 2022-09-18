import loginRouter from './login.js'
import roomRouter from './room.js'

// todo: better params/headers/body error handling
// https://joi.dev/api/?v=17.6.0

export default [
	{
		path: 'login',
		router: loginRouter
	},
	{
		path: 'room',
		router: roomRouter
	}
]

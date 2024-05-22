const User = require('../models/userModel')
const bcryptjs = require('bcryptjs')
const passport = require('passport')

// GET 	/register
exports.register = (req, res) => {
  res.render('register', { title: 'Register Page' })
}
// POST 	/register
exports.handleRegister = async (req, res) => {
	console.log(req.body)

	try{
		let { email, password } = req.body

		const findUser = await User.findOne({ email })
		console.log(findUser)
		if (findUser) return res.render('register', { title: 'Register Page' });

		password = await bcryptjs.hash(password, 10) 

		const user = User.create({ email, password })
		if(!user) return res.status(400).json({ 
			status: 'error', 
			message: 'Saving to database failed' 
		})
		res.redirect('/login');

	}catch(err){
		console.log(err)
		return res.status(400).json({ 
			status: 'failed', 
			message: 'Internal Server Error' 
		})
	}
}

// GET 	/login
exports.login = (req, res) => {
  res.render('login', { title: 'Login Page' })
}

// POST /login
// Method-1: 
// exports.handleLogin = (req, res) => {
// 	res.redirect('/')
// }

// POST /login
exports.handleLogin = (req, res, next) => {
	console.log(req.body)
	
	passport.authenticate('local', (err, user, info) => {
		if(err) return next(err)

		if(!user) return res.json({
			status: 'error',
			message: info.message || 'authentication failed'
		})

		req.login(user, (logError) => {
			if(logError) return next(logError)

			res.redirect('/')
			// res.json({
			// 	status: 'success',
			// 	message: 'authentication success'
			// })
		})
	})(req, res, next)

}


// => GET /logout 		: // use POST, DELETE request, so that accedently not logout by refreshing page or something
exports.logout = (req, res, next) => {
	req.logout((err) => {
		if(err) return next(err)

		res.redirect('/login')
	})
}

// => GET /
exports.home = (req, res, next) => {
	let payload = {
 		title: 'Home Page',
	}
	if( req.isAuthenticated() ) payload.user = req.user

	res.render('home', payload)
}

// => GET /error
exports.error = (req, res, next) => {
  console.log('login-failed')
	res.render('error', { title: 'Error Page' })
}


// // => GET /auth/google 	: handled in pageRoutes
// exports.googleLogin = (req, res, next) => { }
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
			const findUser = await User.findOne({ username:req.body.username })
			console.log(findUser)
			if (findUser) return res.render('register', { title: 'Register Page' });

			// res.send( '<h1>Username already exists.</h1><p>Please <a href="/register">register</a> with another username</p>');

			let username = req.body.username 
			let password = req.body.password 
					password = await bcryptjs.hash(password, 10) 

			const user = User.create({ username, password })
			res.redirect('/login');

	}catch(err){
		console.log(err)
		return res.status(500).json('Internal Server Error')
	}
}

// GET 	/login
exports.login = (req, res) => {
  res.render('login', { title: 'Login Page' })
}

// POST 	/login
exports.handleLogin = (req, res) => {
	// console.log('body', req.body)
	// console.log('user', req.user)

	res.redirect('/')
	// res.status(200).json({
	// 	status: 'success',
	// 	data: req.user
	// })
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


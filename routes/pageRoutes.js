const passport = require('passport')
const { Router } = require('express')
const pageController = require('../controllers/pageController')

// => /
const router = Router()

	router
		.get('/', pageController.home)
		.get('/register', pageController.register)
		.post('/register', pageController.handleRegister)

		.get('/login', pageController.login)
		.post('/login', 
			passport.authenticate('local', { 
				failureRedirect: '/login' 
				// failureRedirect: '/error' 
			}),
			pageController.handleLogin
		)
		.get('/logout', pageController.logout)

		.post('/error', pageController.error)

module.exports = router

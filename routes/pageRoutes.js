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
		// .post('/login', 
		// 	passport.authenticate('local', { failureRedirect: '/error' }),
		// 	pageController.handleLogin
		// )
		.post('/login', pageController.handleLogin)
		.get('/logout', pageController.logout)
		.get('/error', pageController.error)

		.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
		.get('/auth/google/callback', passport.authenticate('google', { 
			successRedirect: '/',
			failureRedirect: '/login'
		}))


module.exports = router

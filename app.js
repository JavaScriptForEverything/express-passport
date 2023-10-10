const path = require('path')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const initializingPassport = require('./views/passportConfig')



const publicDir = path.join(process.cwd(), 'public')

initializingPassport()


const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static( publicDir ))
app.use(session({
	secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict', 	// recomended else show warning

		// expires: new Date(Date.now() + 1000*60*60*24*30), 	// Date format 	: 1 month
		maxAge: 1000*60*60*24*30, 					// Without Date : 1 month
	}
}))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'pug')



const protect = (req, res, next) => {

	// // with only express-session
	// if(req.session.user) return next()
	
	// with passport + express-session
	if(req.user) return next()

	return res.redirect('/login')
}


app.get('/', protect, (req, res) => {
// app.get('/', (req, res) => {

	// // To Logout Method-1: by same route
	// if(req.query.destroy === 'true') {
	// 	return req.session.destroy((err) => {
	// 		if(err) return console.log(`error: ${err.message}`)
	// 		res.redirect('/login')
	// 	})
	// }

	// To Logout by passport: Method-1: by same route
	if(req.query.destroy === 'true') {
		return req.logout((err) => {
			if(err) return next(`error: ${err.message}`)
			res.redirect('/login')
		})
	}

	res.render('home')
})

app.get('/login', (req, res) => {
	res.render('login')
})


app.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	successRedirect: '/'
}))


// Logout Method-2: by different route
app.get('/logout', (req, res) => {

	// // with only express-session
	// req.session.destroy((err) => {
	// 	if(err) return console.log(`error: ${err.message}`)
	// })

	// with passport + express-session
	req.logout((err) => {
		if(err) return next(err.message)
	})

	res.redirect('/login')

})

app.get('/profile', protect, (req, res) => {

	res.render('profile', { user: req.user })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`server on http://localhost:${PORT}`)
})
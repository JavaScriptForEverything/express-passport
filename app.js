const path = require('path')
const express = require('express')
const session = require('express-session')

const publicDir = path.join(process.cwd(), 'public')

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

app.set('view engine', 'pug')



const protect = (req, res, next) => {

	if(req.session.user) {
		return next()
	}

	return res.redirect('/login')
}


app.get('/', protect, (req, res) => {

	// To Logout Method-1: by same route
	if(req.query.destroy === 'true') {
		return req.session.destroy((err) => {
			if(err) return console.log(`error: ${err.message}`)
			res.redirect('/login')
		})
	}

	res.render('home')
})

app.get('/login', (req, res) => {
	res.render('login')
})
app.post('/login', (req, res) => {

	if(req.body.username) {
		req.session.user = req.body

		return res.redirect('/')
	}

	res.render('login')
})


// Logout Method-2: by different route
app.get('/logout', (req, res) => {

	req.session.destroy((err) => {
		if(err) return console.log(`error: ${err.message}`)
	})
	res.redirect('/login')

})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`server on http://localhost:${PORT}`)
})
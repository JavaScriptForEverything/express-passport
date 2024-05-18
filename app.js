const express = require('express')
const passport = require('passport') 					
const session = require('express-session') 	// required for password package
const initializingPassport = require('./controllers/passportConfig')

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))

// Step-1: Setup session for passport depends on
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

// Step-2: attact session to passport after initialize
app.use(passport.initialize())
app.use(passport.session())


app.set('view engine', 'pug')


// Step-4: set Strategies: before protected routes
initializingPassport()

const protect = (req, res, next) => {
	// if(req.user) return next()
	if( req.isAuthenticated() ) return next()

	console.log('protect: login failed: ', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user,
	})

	res.redirect('/login')
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


// Step-3: pass req.body 	to passport.use(new LocalStrategy('local', { ... }))
// // Method-1: direct passport middleware
// app.post('/login', passport.authenticate('local', {
// 	failureRedirect: '/login',
// 	successRedirect: '/'
// }))

// // Method-2: pass self-middleware then passport middleware
// app.post('/login', (req, res, next) => {
// 	console.log('POST /login :req.body', req.body)
// 	next()
// }, passport.authenticate('local', {
// 	successRedirect: '/',
// 	failureRedirect: '/login',
// }))

// // Method-3: pass passport middleware manually function invoke
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : 'authentication succeeded' });
    });      
  })(req, res, next);
});






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
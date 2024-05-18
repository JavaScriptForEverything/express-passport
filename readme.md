## Express with express-session and passport (local Strategy)


``` Terminal:

$ git clone <url>
$ yarn install
$ yarn dev
```

passport: 
is a middleware same as `express-session` middleware.
But it works with other passport strategies, in that case `passport` is the container
middleware which has other sub-middlewares which is known as `Strategy`.


### Step-1: Setup session for passport depends on
```
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
```

### Step-2: attact session to passport after initialize
```
app.use( session({...}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'pug')
...
```

### Step-3: pass req.body to passport.use( Statagy )
```
// Method-1: direct passport middleware
app.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	successRedirect: '/'
}))
```

```
// Method-2: pass self-middleware then passport middleware
app.post('/login', (req, res, next) => {
	console.log('POST /login :req.body', req.body)
	next()
}, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
}))
```

```
// Method-3: pass passport middleware manually function invoke
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


```


### Step-4: set Strategies: before protected routes
```
const initializingPassport = require('./controllers/passportConfig')

...
// after passport session attached, and before protected routes

initializingPassport()
```

``` /controllers/passportConfig.js:


const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Step-4: set Strategies: before protected routes
const initializingPassport = () => {

	/**
	 * app.post('/login', (req, res) => {...})
	 * POST /login 	: { username: 'asdf', password: 'asdf' }
	 * 
	 * username, password, comes from req.body of password.authenticate('local') middleware
	 */
	passport.use(new LocalStrategy((username, password, done) => {

		// const user = await User.findOne({ username })
		console.log('passport.use(...) : cadentials should be: ', { username: 'asdf', password: 'asdf' })

		const user = {
			id: 'alksdfaljdjfa',
			username: 'asdf',
			password: 'asdf'
		}

		if(!user) return done(null, false, { message: 'incorrect username' })
		if(password !== user.password) return done(null, false, { message: 'incorrect password'})

		done(null, user)
	}))

	// Step-5: convert user object to string to save as token on success login
	passport.serializeUser((user, done) => {
		done(null, user.id) 	// (1) which value we pass here
	})

	/** 
	 * Step-6: get the serializeUser string and convert to object, to pass via session
	 * req.user 	= user 	=== 	done(null, user)
	*/ 									//  	(2) : got value from serializeUser(user, done) : done(null, id)
	passport.deserializeUser((id, done) => {
		
		// const user = User.findById(id)
		const user = {
			id: 'alksdfaljdjfa',
			username: 'asdf',
			password: 'asdf'
		}

		done(null, user)
	})
}

module.exports = initializingPassport
```


```
const protect = (req, res, next) => {
	// if(req.user) return next()
	if( req.isAuthenticated() ) return next()

	console.log('protect: login failed: ', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user,
	})

	res.redirect('/login')
}
```

``` app.js

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


app.get('/profile', protect, (req, res) => {

	res.render('profile', { user: req.user })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`server on http://localhost:${PORT}`)
})
```






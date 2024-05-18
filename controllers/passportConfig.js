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
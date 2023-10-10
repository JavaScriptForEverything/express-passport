const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy

const initializingPassport = () => {

	/**
	 * username, password, comes from req.body of password.authenticate('local') middleware
	 * Which we applied on app.post('/login', (req, res) => {...})
	 */
	passport.use(new LocalStrategy((username, password, done) => {

		// const user = await User.findOne({ username })
		const user = {
			id: 'alksdfaljdjfa',
			username: 'asdf',
			password: 'asdf'
		}

		if(!user) return done(null, false)
		if(password !== user.password) return done(null, false)

		done(null, user)
	}))

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

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
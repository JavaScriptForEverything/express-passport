// used in app.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel')
const bcryptjs = require('bcryptjs')

const localAuthenticateUser = async (username , password, done) => {
	try {
  	const user = await User.findOne({ username })
		if (!user) return done(null, false, { message: 'No user with that username' })

		if(bcryptjs.compareSync(password, user.password))
				return done(null, user)
		else
				return done(null, false,{ message: 'wrong password' });

	} catch (err) {
		done(err)
	}
}

exports.passportConfig = () => {
	// NB: don't have 'local' argument any more: 	Wrong => new LocalStrategy('local', localAuthenticateUser)
	passport.use(new LocalStrategy(localAuthenticateUser))


	passport.serializeUser((user, done) => {
		done(null, user.id)
	});

	passport.deserializeUser( async (userId, done) => {
		try {
			const user = await User.findById(userId)
			if(!user) return done(null, false, { message: 'user not find while deserializeUser' })

			done(null, user)

		} catch (err) {
			done(err)
		}
	})
}


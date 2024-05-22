// used in app.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OAuth2Strategy = require('passport-google-oauth2').Strategy;

const User = require('../models/userModel')
const bcryptjs = require('bcryptjs')

const localAuthenticateUser = async (req, email , password, done) => {

	console.log(req.body)

	try {
  	const user = await User.findOne({ email })
		if (!user) return done(null, false, { message: 'No user with that username' })

		if(bcryptjs.compareSync(password, user.password))
				return done(null, user)
		else
				return done(null, false,{ message: 'wrong password' });

	} catch (err) {
		done(err)
	}
}

const googleAuthenticateUser = async (accessToken, refreshToken, profile, done) => {
	try {
		let user = await User.findOne({ clientId: profile.id })
		if(!user) {
			user = await User.create({
				clientId: profile.id,
				name: profile.displayName,
				email: profile.emails[0].value,
				avatar: profile.photos[0].value,
			})
			if(!user) return done('create user in database failed', false)
		}

		return done(null, user)
	} catch (err) {
		if(err instanceof Error) return done(err.message, false)
		return done(err, false)
		
	}
}


exports.passportConfig = () => {
	// NB: don't have 'local' argument any more: 	Wrong => new LocalStrategy('local', localAuthenticateUser)
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true 					// now (username, password, done) => (req, email, password, done)
	}, localAuthenticateUser))

	passport.use( new OAuth2Strategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback', 							// same as origin-redirect: 	if request this route will show google login popup window
		scope: ['profile', 'email'] 												// ?
	}, googleAuthenticateUser))



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


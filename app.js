require('dotenv').config();
const express = require('express')
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')

const pageRouter = require('./routes/pageRoutes')
const userRouter = require('./routes/userRoutes')
const { passportConfig } = require('./controllers/passportConfig')

const { NODE_ENV, DB_LOCAL_URL, DB_REMOTE_URL, SESSION_SECRET } = process.env || {}
const DATABASE_URL = NODE_ENV === 'production' ? DB_REMOTE_URL : DB_LOCAL_URL

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('view engine', 'pug')

// Step-1: set session
app.use(session({
 secret: SESSION_SECRET,
 resave: false,
 saveUninitialized: false,
 store: MongoStore.create({ mongoUrl: DATABASE_URL })
}))



// Step-2: attach session with passport
app.use(passport.initialize())
app.use(passport.session())


// Step-3: Configure passport strategy + serializeUser + deserializeUser
passportConfig()

// Step-4: passport.use(new LocalStrategy(...))
// Step-5: app passport.authenticate('local', {...}) 	on 	`POST /login` route

app.use('/', pageRouter)
app.use('/api/users', userRouter)

app.all('*', (req, res) => {
	res.status(200).json({
		status: 'Not-Found',
		message: `the route ${req.method} ${req.originalUrl} not found`
	})
})

app.use((err, req, res, next) => {
	res.status(400).json({
		status: 'error',
		message: err instanceof Error ? err.message : err
	})
})

module.exports = app
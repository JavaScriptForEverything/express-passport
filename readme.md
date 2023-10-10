## Express with express-session and passport (local Strategy)

```
| 		| in express-session: 		        | in passport: 	
+---------------+--------------------------- 	        +----------------------
. To add user 	: req.session.user = user 	        | done(null, user) 
. To Check user : req.session.user        	        | req.user 
. To remove user: req.session.destryo(err => {...})     | req.logout(err => {...}) 

```


passport: 
is a middleware same as `express-session` middleware.
But it works with other passport strategies, in that case `passport` is the container
middleware which has other sub-middlewares which is known as `Strategy`.


- Step-1:  `authenticate` middleware collect `req.body` which will be available to sub strategy. 

```
const authenticate = (strategy) => (req, res, next) => {...}

app.post('/login', passport.authenticate('local', {...}))
```



- Step-2:  Now we have req.body, so can configuring strategy into a function and attach that function
to app. Bellow an example of LocalStrategy:

``` /passportConfig.js:

const passport = require('passport') 
const LocalStrategy = require('passport-local').Strategy

const initializingPassport = () => { 

// username, password, comes from req.body of password.authenticate('local') middleware
// Which we applied on app.post('/login', (req, res) => {...}) 

        passport.use(new LocalStrategy((username, password, done) => { 

	//      const user = await User.findOne({ username }) 
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
	//      const user = User.findById(id)
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



``` /app.js:		

...	
const initializingPassport = require('./views/passportConfig') 

initializingPassport()
const app = express()
...
```



- Step-3:  Now we have LocalStrategy ready, we we have to apply to app as a middleware: to app. Bellow an example of LocalStrategy: 

``` /app.js:	
app.use(express.urlencoded({ extended: false })) 
app.use(express.static( publicDir )) 		
...	
app.use(passport.initialize())
```


Local Strategy require `express-session` before passport.initialize() middleware 	

``` /app.js:	
...	
app.use(session({ ... })) 	        // const session = require('express-session')
app.use(passport.initialize())
app.use(passport.session()) 
...
```


- Step-4:  Protect any route by creating middleware:

``` /controllers/autoController.js:	

const protect = (req, res, next) => {

        // // with only express-session 
        // if(req.session.user) return next() 

        // with passport + express-session 
        if(req.user) return next() 

        return res.redirect('/login') 
} 
```


``` /app.js: 	
...
app.get('/', protect, homeRoute) 
app.get('/profile', protect, profileRoute)
...
```


- Step-5:  Finally destroy session: 


``` /app.js
app.get('/logout', (req, res) => { 

        req.logout((err) => {
        if(err) return next(err.message) 
        })

        res.redirect('/login') 
}) 


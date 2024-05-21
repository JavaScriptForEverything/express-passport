const app = require('./app')
const { dbConnect } = require('./models/dbConnect')


const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
	await dbConnect()
	console.log(`server listing on port: ${PORT}`)
})
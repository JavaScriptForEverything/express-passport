const mongoose = require('mongoose')

/*
	name: 'riajul islam',
	email: 'abc@gmail.com',
	password: 'asdfasdf',
	avatar: '/default.jpg',
	clientId: 'google',
*/

var userSchema = new mongoose.Schema({
    email: { 						// email
        type : String,
        unique : true,
        // required : true
    },
    password: {
        type: String,
        // required: true
    },
		clientId: { 									// ['google', 'facebook', 'github']
			type: String,
		},
		avatar: String,
		name: String,
})
const User = mongoose.model('User',userSchema)
module.exports = User
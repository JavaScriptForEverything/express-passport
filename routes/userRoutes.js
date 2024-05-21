const { Router } = require('express')
const userController = require('../controllers/userController')

const router = Router()

	router.route('/')
		.get(userController.getAllUsers)
		.post(userController.createUser)

module.exports = router
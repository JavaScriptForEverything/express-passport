
exports.getAllUsers = (req, res, next) => {

	res.status(200).json({
		status: 'success',
		data: {}
	})
}
exports.createUser = (req, res, next) => {

	res.status(200).json({
		status: 'success',
		data: req.body
	})
}
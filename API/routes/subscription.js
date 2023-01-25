const express = require('express')
const mongo_subscription = require('../mongo_calls/mongo_subscription')
const authRoutines = require('../middlewares/authRoutines')

const router = express.Router();

router.use(authRoutines.forbidGuests)

router.post('/:userPseudo', (req, res) => 
{
	let userPseudo = req.params.userPseudo
	mongo_subscription.subscribe(req.user.pseudo, userPseudo).then(
		() => res.status(200).json({})
	).catch( err =>
		{
			console.log(err);
			if (!err.status) {err.status === 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		}
	)
});

router.delete('/:userPseudo', (req, res) => 
{
	let userPseudo = req.params.userPseudo
	mongo_subscription.unsubscribe(req.user.pseudo, userPseudo).then(
		() => res.status(200).json({})
	).catch(err => 
		{
			console.log(err);
			if (!err.status) {err.status === 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		})
});

module.exports = router

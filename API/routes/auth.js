const mongo_auth = require('../mongo_calls/mongo_auth')
const authRoutines = require('../middlewares/authRoutines')

const express = require('express')

const router = express.Router();


router.post('/register', (req, res) => 
{
	mongo_auth.register(req.body.pseudo, req.body.password).then( () =>
		{
			res.status(201).json({jwt : authRoutines.generateToken(req.body.pseudo)})
		}
	).catch
	(err =>
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		}
	)
});

router.post('/login', (req, res) => 
{
	mongo_auth.login(req.body.pseudo, req.body.password).then( loggedIn => 
		{
			if (loggedIn)
			{
				res.status(200).json({jwt : authRoutines.generateToken(req.body.pseudo)})
			}
			else
			{
				res.status(401).json({message : "Authentification failed"})
			}
		}
	).catch( err => 
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		}
	)
});

router.delete('/delete', authRoutines.forbidGuests, (req, res) => 
{
	mongo_auth.delete(req.user.pseudo, req.body.password).then(() =>
		{
			res.status(200).json()
		}).catch( err => 
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.statis).json({message : err.message})
		}			
		)
	
});


module.exports = router;
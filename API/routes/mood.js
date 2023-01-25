const express = require('express')

const mongo_mood = require('../mongo_calls/mongo_mood')
const mongo_subscription = require('../mongo_calls/mongo_subscription')
const authRoutines = require('../middlewares/authRoutines')

const router = express.Router();

router.use(authRoutines.forbidGuests)

router.post('/mine', (req, res) => 
{
	mongo_mood.setMoodOfOne(req.user.pseudo, req.body.mood).then(
		() => 
		{
			res.status(201).json({})
		}
	).catch(err => 
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		})
});

router.get('/mine', (req, res) => 
{
	mongo_mood.getMoodOfOne(req.user.pseudo).then(
		result =>
		{
			res.status(200).json({mood : result})
		}
	).catch(err => 
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		})
});

router.delete('/mine', (req, res) => 
{
	mongo_mood.setMoodOfOne(req.user.pseudo, null).then(
		() => 
		{
			res.status(201).json({})
		}
	).catch(err => 
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		})
});

router.put('/mine', (req, res) => 
{
	mongo_mood.setMoodOfOne(req.user.pseudo, req.body.mood).then(
		() => 
		{
			res.status(201).json({})
		}
	).catch(err => 
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		})
});

router.get('/overview', (req, res) => 
{
	mongo_mood.getAllMoods().then(result => 
		{
			res.status(200).json(result)
		}).catch(err => 
			{
				if (!err.status) {err.status = 500; err.message = "Unknown error"}
				res.status(err.status).json({message : err.message})
			})
});

router.get('/subscriptions', (req, res) => 
{
	(async () => 
	{
		try {
			let subs = await mongo_subscription.getSubscriptions(req.user.pseudo)
			let result = await mongo_mood.getMoodOfMultiple(subs)
			res.status(200).json(result)
		}
		catch (err)
		{
			if (!err.status) {err.status = 500; err.message = "Unknown error"}
			res.status(err.status).json({message : err.message})
		}
	})()
});

module.exports = router;
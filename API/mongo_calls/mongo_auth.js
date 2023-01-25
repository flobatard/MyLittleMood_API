const getMongoDB = require("./connect")
const bcrypt = require("bcrypt")
require("dotenv").config();

const saltRounds=10

const getMongoDBUserCollection = async () =>
{
	let mongoDB = await getMongoDB();
	return (await mongoDB.collection('user'))
}

exports.register = async (pseudo, password) =>
{
	if (pseudo.length < 4)
	{
		throw {status : 400, message : "Pseudo to short (>3)"}
	}
	if (password.length < 4)
	{
		throw {status : 400, message : "Password too short (>3)"}
	}
	let userCollection = await getMongoDBUserCollection();
	let hash = await bcrypt.hash(password, saltRounds);
	await userCollection.insertOne({_id:pseudo, password:hash, subscriptions:[], mood:null});
	
}

exports.login = async (pseudo, password) => 
{
	let userCollection = await getMongoDBUserCollection();
	let user = await userCollection.findOne({_id:pseudo})
	let res = false;
	if (user !== null)
	{
		res = await bcrypt.compare(password, user.password)
	}
	return res;
}

exports.delete = async (pseudo, password) =>
{
	let userCollection = await getMongoDBUserCollection();

	let user = await userCollection.findOne({_id:pseudo})
	if (user !== null)
	{
		let isPasswordGood = await bcrypt.compare(password, user.password);

		if (isPasswordGood)
		{
			let res = await userCollection.deleteOne({_id : pseudo})
		}
		else
		{
			throw ({status : 403, message : "Incorrect Password"})
		}
	}
	else
	{
		throw ({status:404, message:'Pseudo not found'})
	}
}

exports.isUser = async (pseudo) =>
{
	let userCollection = await getMongoDBUserCollection();

	let user = await userCollection.findOne({_id:pseudo})

	return user !== null
}
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let mongoDB = undefined;

const startMongoDB = (async () => {
	try
	{
		let mongoClient = await client.connect();
		mongoDB = mongoClient.db('MyLittleMood');
	}
	catch (err)
	{
		throw err;
	}
});

const getMongoDB = async () => 
{
	if (mongoDB === undefined)
	{
		await startMongoDB();
	}
	return mongoDB;
}

module.exports = getMongoDB;


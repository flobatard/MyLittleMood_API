const getMongoDB = require("./connect")

const getMongoDBUserCollection = async () =>
{
	let mongoDB = await getMongoDB();
	return (await mongoDB.collection('user'))
}

exports.getMoodOfOne = async (pseudo) =>
{
    let userCollection = await getMongoDBUserCollection();
    let user = await userCollection.findOne({_id:pseudo})
    let ret = null;
    ret = user?.mood;
    return ret;
}

exports.getMoodOfMultiple = async (pseudos) =>
{
    let userCollection = await getMongoDBUserCollection();
    let users = await userCollection.findMuliple({_id: {$in: [pseudos]}})
    let moods = users.map(user => user.mood)
    return moods;
}

exports.setMoodOfOne = async (pseudo, mood) =>
{
    let userCollection = await getMongoDBUserCollection();
    let ret = await userCollection.updateOne({_id: pseudo}, {$set: {
        mood: {
            mood
        }
    }})
    return ret.modifiedCount>0
}

exports.getAllMoods = async () =>
{
    let userCollection = await getMongoDBUserCollection();
    let ret = await userCollection.aggregate({$group : {_id:'$mood', count:{$sum:1}}}, {$sort: {count:-1}})
    return ret;
}
const { unsubscribe } = require("../routes/auth");
const getMongoDB = require("./connect")
const authUser = require('./mongo_auth')

const getMongoDBUserCollection = async () =>
{
	let mongoDB = await getMongoDB();
	return (await mongoDB.collection('user'))
}

exports.subscribe = async (userPseudo, pseudoToSubscribe) =>
{
    let userCollection = await getMongoDBUserCollection()
    let pseudoExist = await authUser.isUser(pseudoToSubscribe)
    if (pseudoExist)
    {
        let ret = userCollection.updateOne({_id:userPseudo}, {$addToSet : {subscriptions : pseudoToSubscribe}})
        return ret.modifiedCount>0
    }
    else
    {
        throw {status : 404, message : 'Unknown pseudo'}
    }
    let ret = userCollection.updateOne({_id:userPseudo}, )
}

exports.unsubscribe = async (userPseudo, pseudoToUnsubscrive) =>
{
    let userCollection = await getMongoDBUserCollection()
    let ret = userCollection.updateOne({_id:userPseudo}, {$pull: {subscriptions: {$in: [pseudoToUnsubscrive]}}})
    return ret.modifiedCount>0
}

exports.getSubscriptions = async (userPseudo) =>
{
    let userCollection = await getMongoDBUserCollection()
    let result = userCollection.findOne({_id:userPseudo})
    if (result === null)
    {
        throw {status : 404, message : 'Unknown pseudo'}
    }
    
    return ret.subscriptions
}
require("dotenv").config();
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => 
{
	const authHeader = req.headers['authorization']
	const token = authHeader 
	if (token == null || token == "Guest")
	{
		req.user = null;
	}
	else
	{
		jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
			if (err) 
			{
				console.log("This token is not jwt verified: ", token); 
				req.user = null; req.tokenExpired = true;
			}
			else 
			{
				req.user = user; 
			}
		})
	}
	next();
}

exports.forbidGuests = (req, res, next) =>
{
	if (req.user === null)
	{
		if (req.tokenExpired)
		{
			res.status(401).json({status : 401, message : "Your authentification token expired"})
		}
		else
		{
			res.status(401).json({status : 401, message: "You can't make this request as a guest"});
		}
		
	}
	else
	{
		next();
	}
}

exports.generateToken = (pseudo) => {
	return jwt.sign({pseudo: pseudo}, process.env.TOKEN_SECRET_KEY, {expiresIn: '1d'});
}
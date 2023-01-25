require("dotenv").config();
const express = require('express');

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");

const jwt = require('jsonwebtoken');

const authRoutines = require('./middlewares/authRoutines')

var server = http.createServer(app);

const rootUrl = ''

app.get('/api/status', (req, res) => {
  res.status(200).json({info: 'MyLittleMood: Node.js, Express, and MongoDB'});
});

app.get('/', (req, res) => 
{
	res.status(200).send('Hello from MyLittleMood')
});

app.use(bodyParser.json([]));
app.use(cors());
app.use(authRoutines.authenticateToken)
app.use(`${rootUrl}/auth`, require('./routes/auth'));


// Listen to the specified port, otherwise 3080
const PORT = process.env.PORT || 3080;
server.listen(PORT, () => {
  console.log(`Server Running: http://localhost:${PORT}`);
});
/**
 * The SIGTERM signal is a generic signal used to cause program 
 * termination. Unlike SIGKILL , this signal can be blocked, 
 * handled, and ignored. It is the normal way to politely ask a 
 * program to terminate. The shell command kill generates 
 * SIGTERM by default.
 */
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server Close: Process Terminated!');
    });
});
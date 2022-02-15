const connectDB = require('./db/connection.js');
const express = require('express');
const app = express();
const port = 3000;
const tasks = require('./routes/tasks.js');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error');
require('dotenv').config();

//middleware
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/v1/tasks', tasks);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		console.log('Connected to DB...');
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();

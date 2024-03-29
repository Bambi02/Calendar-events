const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	day: String,
	month: String,
	year: String,
});

module.exports = mongoose.model('Task', TaskSchema);

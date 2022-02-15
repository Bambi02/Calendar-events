const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');
const mongoose = require('mongoose');

const getAllTasks = asyncWrapper(async (req, res) => {
	const tasks = await Task.find({});
	res.status(201).json({ tasks });
});

const addTask = asyncWrapper(async (req, res) => {
	const task = await Task.create(req.body);
	res.status(201).json({ task });
});

const getSingleTask = asyncWrapper(async (req, res, next) => {
	const id = req.params.id;
	const task = await Task.findById(id);
	//const task = await Task.findById(id);

	if (!task) {
		return next(createCustomError(`there is no item with id: ${id}`, 404));
	}

	res.status(200).json({ task });

	console.log(mongoose.Types.ObjectId.isValid('6206343b86571c574bea69f1'));
	// true
	console.log(mongoose.Types.ObjectId.isValid('6206343b86571c574bea69f'));
	// false
});

const editTask = asyncWrapper(async (req, res) => {
	const id = req.params.id;
	const task = await Task.findOneAndUpdate({ _id: id }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!task) {
		return next(createCustomError(`there is no item with id: ${id}`, 404));
	}

	res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
	const id = req.params.id;
	const task = await Task.findOneAndRemove({ _id: id });

	if (!task) {
		return next(createCustomError(`there is no item with id: ${id}`, 404));
	}

	res.status(200).json({ task });
});

module.exports = { getAllTasks, addTask, getSingleTask, editTask, deleteTask };

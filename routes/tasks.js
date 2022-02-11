const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  addTask,
  getSingleTask,
  editTask,
  deleteTask,
} = require('../controllers/tasks.js');

router.route('/').get(getAllTasks).post(addTask);

router.route('/:id').get(getSingleTask).patch(editTask).delete(deleteTask);

module.exports = router;

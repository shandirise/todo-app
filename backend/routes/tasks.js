const express = require('express');
const router = express.Router();
const { Task } = require('../models');

router.get('/', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  await task.update(req.body);
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;

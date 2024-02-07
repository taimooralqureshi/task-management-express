import express, { Router } from 'express';
import bodyParser from 'body-parser';
import Task, { ITask } from './task.model';
import { paginate } from 'utils/pagination';
import { isObjectIdOrHexString } from 'mongoose';


const router: Router = express.Router();

router.use(bodyParser.json());

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, tags, priority } = req.body;

    const newTask = new Task({ title, description, status, tags, priority });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error ? error : 'Internal Server Error' });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
  
   // Use the paginate utility function
   const result = paginate(tasks, page, pageSize);

   // Return the paginated tasks along with pagination metadata
   res.json(result);
  } catch (error) {
    res.status(500).json({ error: error ? error : 'Internal Server Error' });
  }
});

// Get a task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({id});

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error ? error : 'Internal Server Error' });
  }
});

// Update a task by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, tags, priority } = req.body;
    const updatedTaskObj: Partial<ITask> = {
      title,
      description,
      status,
      tags,
      priority,
      updated_at: new Date(),
    };
    const updatedTask = await Task.findOneAndUpdate({ id }, updatedTaskObj, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error ? error : 'Internal Server Error' });
  }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is parseable to a number
    const task = isObjectIdOrHexString(id)
      ? await Task.findByIdAndDelete(id)
      : await Task.findOneAndDelete({ id });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error ? error : 'Internal Server Error' });
  }
});


export = router;

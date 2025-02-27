import express  from "express";
import { v4 as uuidv4 } from 'uuid';
import fs from "node:fs"

const router = express.Router();

const getAllTasks = async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', 'utf8');
        const tasksData = JSON.parse(data);

        const { completed, search, sort } = req.query;

        if (completed === 'true') {
            tasksData.tasks = tasksData.tasks.filter((t) => t.completed);
        } else if (completed === 'false') {
            tasksData.tasks = tasksData.tasks.filter((t) => !t.completed);
        }

        if (search) {
            tasksData.tasks = tasksData.tasks.filter(task => 
              task.title.toLowerCase().includes(search.toLowerCase()) || 
              task.description.toLowerCase().includes(search.toLowerCase())
            );
          }

          if(sort) {
            if (sort === 'asc') {
              tasksData.tasks = tasksData.tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else if (sort === 'desc') {
              tasksData.tasks = tasksData.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
          }

        tasksData.tasks = tasksData.tasks.reverse();
        res.json(tasksData.tasks);
    } catch (err) {
        res.status(500).json({ error: 'Error reading tasks' });
    }
}

const getAllTasksbyPriority = async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', 'utf8');
        const tasksData = JSON.parse(data);

        const { level } = req.params;

        const lowercase = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();

        if (!['High', 'Medium', 'Low'].includes(lowercase)) {
            return res.status(400).json({ error: 'Invalid priority level. Must be High, Medium, or Low' });
        }

        tasksData.tasks = tasksData.tasks.filter((t) => t.Priority === lowercase);
        tasksData.tasks = tasksData.tasks.reverse();
        res.json(tasksData.tasks);
    } catch (err) {
        res.status(500).json({ error: 'Error reading tasks' });
    }
}

const getATask =  async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', "utf8");
        const tasks = JSON.parse(data);
        const id = req.params.id;
        
        const task = tasks.tasks.find((t) => t.id.toString() === id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const addAtasks = async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', 'utf8')
        const tasks = JSON.parse(data);

        const newTasks = req.body

        if(!newTasks.title || !newTasks.description){
            return res.status(400).json({ error: 'Title and description are required' });
        }

        if(!newTasks.completed || typeof(newTasks.completed) !== 'boolean'){
            newTasks.completed = false
        }

        if(!newTasks.Priority){
            newTasks.Priority = 'Low'
        }

        newTasks.id = uuidv4()
        newTasks.createdAt = new Date().toISOString()

        tasks.tasks.push(newTasks)

        const controller = new AbortController();
        const { signal } = controller;
        await fs.promises.writeFile('task.json', JSON.stringify(tasks, null, 2), { encoding: 'utf8', signal });      
              
        res.json(newTasks)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const updateATask = async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', "utf8");
        const tasks = JSON.parse(data);
        const id = req.params.id;
        
        const taskIndex = tasks.tasks.findIndex((t) => t.id.toString() === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = {
            ...tasks.tasks[taskIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        tasks.tasks[taskIndex] = updatedTask;

        await fs.promises.writeFile('task.json', JSON.stringify(tasks, null, 2), { encoding: 'utf8' });      

      
        res.json(updatedTask);
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteATask = async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', "utf8");
        const tasks = JSON.parse(data);
        const id = req.params.id;

        const taskIndex = tasks.tasks.findIndex((t) => t.id.toString() === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }


        tasks.tasks.splice(taskIndex, 1);

        await fs.promises.writeFile('task.json', JSON.stringify(tasks, null, 2), { encoding: 'utf8' });      

      
        res.json({ message: 'Task deleted successfully' });
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

router.get('/tasks', getAllTasks )
router.get('/tasks/:id', getATask)
router.post('/tasks', addAtasks)
router.put('/tasks/:id', updateATask)
router.delete('/tasks/:id', deleteATask)
router.get('/tasks/priority/:level', getAllTasksbyPriority)

export default router
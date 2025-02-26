import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from "node:fs"
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks', async (req, res) => {
    const tasks = await fs.promises.readFile('task.json', (err, data) => {
        if (err) throw err;
        console.log(data);
      });

      console.log('tasks', tasks)

      res.send(tasks)
})

app.get('/tasks/:id', async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', "utf8");
        const tasks = JSON.parse(data);
        const id = req.params.id;

        console.log(typeof(id))
        
        const task = tasks.tasks.find((t) => t.id.toString() === id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.post('/tasks', async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', 'utf8')
        const tasks = JSON.parse(data);

        const newTasks = req.body
        newTasks.id = uuidv4()
        newTasks.createdAt = new Date().toISOString()

        tasks.tasks.push(newTasks)

        console.log('newTasks', newTasks)

        const controller = new AbortController();
        const { signal } = controller;
        await fs.promises.writeFile('task.json', JSON.stringify(tasks, null, 2), { encoding: 'utf8', signal });      
              
        res.json(newTasks)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.put('/tasks/:id', async (req, res) => {
    try {
        const data = await fs.promises.readFile('task.json', "utf8");
        const tasks = JSON.parse(data);
        const id = req.params.id;

        const newTasks = req.body
        newTasks.createdAt = new Date().toISOString()
        
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
})

app.delete('/tasks/:id', async (req, res) => {
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
})

app.get('/')

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



export default app
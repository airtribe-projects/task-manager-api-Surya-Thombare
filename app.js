import express from 'express';
const app = express();
const port = 3000;

import tasksRoutes from './routes/tasks.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/v1', tasksRoutes)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



export default app
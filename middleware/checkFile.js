import fs from "node:fs"

const isFileExist = !fs.existsSync('task.json')


export const checkFile  = (req, res, next) => {
    if (isFileExist) res.status(500).json({ error: 'Error fetching tasks' });
    next()
}

export const createFile  = (req, res, next) => {
    if (isFileExist) {
        const initialData = { tasks: [] };
        fs.writeFileSync('task.json', JSON.stringify(initialData, null, 2), 'utf8');
        console.log('task.json created with an empty tasks array.');
        next()
    }
}


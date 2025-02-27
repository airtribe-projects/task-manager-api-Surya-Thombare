import fs from "node:fs"

const isFileExist = fs.existsSync('tasks.json')

export const checkFile = (req, res, next) => {
    if (!isFileExist) {
        return res.status(500).json({ error: 'Error fetching tasks' });
    }
    next();
}

export const createFile = (req, res, next) => {
    if (!isFileExist) {
        const initialData = { tasks: [] };
        try {
            fs.writeFileSync('tasks.json', JSON.stringify(initialData, null, 2), 'utf8');
            console.log('tasks.json created with an empty tasks array.');
        } catch (error) {
            return res.status(500).json({ error: 'Error creating tasks file' });
        }
    }
    next();
}

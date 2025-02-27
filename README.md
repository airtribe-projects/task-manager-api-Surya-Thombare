# Task Manager API

A RESTful API for managing tasks with features like priority levels, completion status, and searching capabilities.

## Overview

This Task Manager API provides a complete solution for managing tasks with the following features:
- Create, Read, Update, and Delete tasks
- Filter tasks by completion status
- Search tasks by title or description
- Sort tasks by creation date
- Filter tasks by priority level
- Automatic timestamp management for task creation and updates

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Get All Tasks
- **GET** `/tasks`
- **Query Parameters:**
  - `completed`: Filter by completion status (`true`/`false`)
  - `search`: Search in title and description
  - `sort`: Sort by creation date (`asc`/`desc`)
- **Example:**
  ```
  GET /tasks?completed=true&search=project&sort=desc
  ```

### Get Task by ID
- **GET** `/tasks/:id`
- **Example:**
  ```
  GET /tasks/9b63a89e-535f-48d0-b216-8a6e918d415b
  ```

### Create New Task
- **POST** `/tasks`
- **Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "completed": false,
    "Priority": "High"
  }
  ```
- **Notes:**
  - `title` and `description` are required
  - `completed` defaults to `false` if not provided
  - `Priority` must be one of: "High", "Medium", "Low" (defaults to "Low")

### Update Task
- **PUT** `/tasks/:id`
- **Body:** Same as Create Task
- **Example:**
  ```
  PUT /tasks/9b63a89e-535f-48d0-b216-8a6e918d415b
  ```

### Delete Task
- **DELETE** `/tasks/:id`
- **Example:**
  ```
  DELETE /tasks/9b63a89e-535f-48d0-b216-8a6e918d415b
  ```

### Filter Tasks by Priority
- **GET** `/tasks/priority/:level`
- **Parameters:**
  - `level`: Must be one of: "High", "Medium", "Low" (case-insensitive)
- **Example:**
  ```
  GET /tasks/priority/high
  ```

## Testing the API

You can test the API using tools like Postman or curl. Here are some example curl commands:

1. Get all tasks:
```bash
curl http://localhost:3000/tasks
```

2. Get completed tasks:
```bash
curl http://localhost:3000/tasks?completed=true
```

3. Search tasks:
```bash
curl http://localhost:3000/tasks?search=project
```

4. Create a new task:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task Description","Priority":"High"}'
```

5. Update a task:
```bash
curl -X PUT http://localhost:3000/tasks/task-id \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

6. Get high priority tasks:
```bash
curl http://localhost:3000/tasks/priority/high
```
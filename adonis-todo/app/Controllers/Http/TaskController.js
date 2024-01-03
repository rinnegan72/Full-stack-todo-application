// app/Controllers/Http/TaskController.js

'use strict'

const Task = use('App/Models/Task')

class TaskController {
  async create({ request, response }) {
    try {
      console.log('Creating a new task');
      const { title, description, due_date, completed } = request.all();

        // Check if title is null or empty
        if (!title) {
          console.log('Title is null or empty');
        
          return response.status(400).json({ error: 'Title cannot be null or empty' });
        }

    const task = await Task.create({
      title,
      description,
      due_date,
      completed: false, // You can set the default completion status as needed
    });

    return task;
  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' });
  }
  }

  async index ({ response }) {
    const tasks = await Task.all()
    return response.json(tasks)
  }

  async store ({ request, response }) {
    const data = request.only(['title', 'description', 'completed', 'due_date'])
    const task = await Task.create(data)
    return response.json(task)
  }

  async show ({ params, response }) {
    const task = await Task.find(params.id)
    return response.json(task)
  }

  async update ({ params, request, response }) {
    const task = await Task.find(params.id)
    task.merge(request.only(['title', 'description', 'completed', 'due_date']))
    await task.save()
    return response.json(task)
  }

  async destroy ({ params, response }) {
    const task = await Task.find(params.id)
    await task.delete()
    return response.json({ message: 'Task deleted' })
  }
}

module.exports = TaskController
// app/Controllers/Http/TaskController.js

'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
  async create({ request, response }) {
    const { title, due_date } = request.all();
    const rules = {
      title: 'required',
      due_date: 'date',
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.badRequest(validation.messages());
    }

    const task = await Task.create({
      title,
      completed: false, // You can set the default completion status as needed
    });

    return task;
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
// app/Controllers/Http/TaskController.js

'use strict'

const Task = use('App/Models/Task')

const { validate } = use('Validator');


class TaskController {
  async create({ request, response }) {
    try {
      console.log('Request Payload1:', request.all());
      console.log('Creating a new task');
      const { title, description, due_date, completed} = request.all();
           // Validate the title
           const rules = {
            title: 'required|max:255',
        };

        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
          return response.status(400).json({
            error: 'Validation failed in Create',
            messages: validation.messages(),
          });
        }
    // Create a new task
    const task = await Task.create({
      title,
      description,
      due_date,
      completed // You can set the default completion status as needed
    });
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    
      // Check if the error is due to a specific database constraint
      if (error.code === 'ER_BAD_NULL_ERROR' && error.column === 'title') {
        // Return a custom error message for the 'title cannot be null' issue
        return response.status(400).json({
          error: 'Title cannot be null',
        });
      }
    // Log the error details
    console.error(error.message);
    console.error(error.stack);

    // Return a more informative response
    return response.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });}
  }

  async index ({ response }) {
    const tasks = await Task.all()
    return response.json(tasks)
  }

    async store({ request, response }) {
      try {
        const { title, description, due_date, completed } = request.all();

        const rules = {
          title: 'required',
          due_date: 'date', // Add this line to validate due_date as a date
        };
        
        const messages = {
          'title.required': 'Title is required',
          'due_date.date': 'Due date must be a valid date',
        };
        
        const validation = await validate(request.all(), rules, messages);
        
        if (validation.fails()) {
          // Handle validation errors
          return response.status(400).json({
            error: 'Validation failed',
            messages: validation.messages(),
          });
        }
        
        // Rest of your code for creating a new task
        


        const task = await Task.create({
          title,
          description,
          due_date,
          completed, //Sriram removing false from here.
        });
  
        return response.status(201).json(task); // Use 201 Created status
      } catch (error) {
        console.error('Error creating task:', error);
        return response.status(500).json({
          error: 'Internal Server Error',
          message: error.message,
        });
      }
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

module.exports = TaskController;
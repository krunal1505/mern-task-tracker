import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

class TasksController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      let allTasks = await AppDataSource.getRepository(Task).find({
        order: { date: 'ASC' },
      });
      allTasks = instanceToPlain(allTasks) as Task[];
      return res.status(200).json(allTasks);
    } catch (_error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newTask = new Task();
      newTask.title = req.body.title;
      newTask.date = req.body.date;
      newTask.description = req.body.description;
      newTask.priority = req.body.priority;
      newTask.status = req.body.status;

      let createdTask: Task = await AppDataSource.getRepository(Task).save(
        newTask,
      );
      createdTask = instanceToPlain(createdTask) as Task;
      return res.status(201).json(createdTask);
    } catch (_error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const taskController = new TasksController();

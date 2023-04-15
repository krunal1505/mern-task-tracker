import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

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
    try {
      const errors = validationResult(req);
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

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task: Task | null = await AppDataSource.getRepository(Task).findOne(
        {
          where: { id: req.body.id },
        },
      );

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      let updatedTask: UpdateResult = await AppDataSource.getRepository(
        Task,
      ).update(
        req.body.id,
        plainToInstance(Task, {
          status: req.body.status,
        }),
      );
      updatedTask = instanceToPlain(updatedTask) as UpdateResult;
      return res.status(200).json(updatedTask);
    } catch (_error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const taskController = new TasksController();

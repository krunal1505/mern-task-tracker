import { Router, Request, Response } from 'express';
import { TasksController } from './tasks.controller';

export const tasksRouter: Router = Router();

tasksRouter.get('/tasks', async (req: Request, res: Response) => {
  const taskController = new TasksController();
  const allTasks = await taskController.getAll();
  res.status(200).json(allTasks);
});

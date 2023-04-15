import { Router } from 'express';
import { taskController } from './tasks.controller';
import { createValidator } from './tasks.validator';

export const tasksRouter: Router = Router();

tasksRouter.get('/', taskController.getAll);

tasksRouter.post('/', createValidator, taskController.create);

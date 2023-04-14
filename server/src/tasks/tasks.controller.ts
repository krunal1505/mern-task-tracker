import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import { instanceToPlain } from 'class-transformer';

export class TasksController {
  constructor(private taskRepository = AppDataSource.getRepository(Task)) {}

  public async getAll(): Promise<Task[] | unknown> {
    try {
      let allTasks = await this.taskRepository.find({
        order: { date: 'ASC' },
      });
      allTasks = instanceToPlain(allTasks) as Task[];
      return allTasks;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

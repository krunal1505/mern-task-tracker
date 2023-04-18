import { Priority } from '../../createTaskForm/enums/Priority';

export const renderPriorityBorderColor = (priority: string): string => {
  switch (priority) {
    case Priority.normal:
      return 'success.light';
    case Priority.low:
      return 'info.light';
    case Priority.high:
      return 'error.light';
    default:
      return 'grey.900';
  }
};

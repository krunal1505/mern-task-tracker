import React, { FC, ReactElement, useContext, useEffect } from 'react';
import { Grid, Box, Alert, LinearProgress } from '@mui/material';
import { format } from 'date-fns';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TaskCounter } from '../taskCounter/TaskCounter';
import { Task } from '../task/Task';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ITaskApi } from './interfaces/ITaskApi';
import { Status } from '../createTaskForm/enums/Status';
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { countTasks } from './helpers/countTasks';
import { TaskStatusChangeContext } from '../../context';

export const TaskArea: FC = (): ReactElement => {
  const taskUpdatedContext = useContext(TaskStatusChangeContext);

  const { error, isLoading, data, refetch } = useQuery(['tasks'], async () => {
    return await sendApiRequest<ITaskApi[]>(
      'http://localhost:5000/tasks',
      'GET',
    );
  });

  const updateTaskMutation = useMutation((data: IUpdateTask) =>
    sendApiRequest('http://localhost:5000/tasks', 'PUT', data),
  );

  const onStatusChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    updateTaskMutation.mutate({
      id,
      status: e.target.checked ? Status.inProgress : Status.todo,
    });
  };

  const markCompleteHandler = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    updateTaskMutation.mutate({ id, status: Status.completed });
  };

  useEffect(() => {
    refetch();
  }, [taskUpdatedContext.updated]);

  useEffect(() => {
    if (updateTaskMutation.isSuccess) {
      taskUpdatedContext.toggle();
    }
  }, [updateTaskMutation.isSuccess]);

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>Status of your Tasks As On {format(new Date(), 'PPPP')}</h2>
      </Box>
      <Grid container display="flex" justifyContent="center">
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          md={10}
          xs={12}
          mb={8}
        >
          <TaskCounter
            count={data ? countTasks(data, Status.todo) : undefined}
            status={Status.todo}
          />
          <TaskCounter
            count={data ? countTasks(data, Status.inProgress) : undefined}
            status={Status.inProgress}
          />
          <TaskCounter
            count={data ? countTasks(data, Status.completed) : undefined}
            status={Status.completed}
          />
        </Grid>
        <Grid item display="flex" flexDirection="column" xs={10} md={8}>
          <>
            {error && <Alert severity="error">Error fetching tasks</Alert>}
            {!error && Array.isArray(data) && data.length > 0 && (
              <Alert severity="warning">You dont have any tasks yet</Alert>
            )}
            {isLoading ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((each, index) => {
                return each.status === Status.todo ||
                  each.status === Status.inProgress ? (
                  <Task
                    key={index}
                    id={each.id}
                    title={each.title}
                    description={each.description}
                    date={new Date(each.date)}
                    priority={each.priority}
                    status={each.status}
                    onStatusChange={onStatusChangeHandler}
                    onClick={markCompleteHandler}
                  />
                ) : (
                  false
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

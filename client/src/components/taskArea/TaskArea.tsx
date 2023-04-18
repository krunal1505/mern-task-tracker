import React, { FC, ReactElement } from 'react';
import { Grid, Box, Alert, LinearProgress } from '@mui/material';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { TaskCounter } from '../taskCounter/TaskCounter';
import { Task } from '../task/Task';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ITaskApi } from './interfaces/ITaskApi';

export const TaskArea: FC = (): ReactElement => {
  const { error, isLoading, data, refetch } = useQuery(['tasks'], async () => {
    return await sendApiRequest<ITaskApi[]>(
      'http://localhost:5000/tasks',
      'GET',
    );
  });

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
          <TaskCounter />
          <TaskCounter />
          <TaskCounter />
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
                return (
                  <Task
                    key={index}
                    id={each.id}
                    title={each.title}
                    description={each.description}
                    date={new Date(each.date)}
                    priority={each.priority}
                    status={each.status}
                  />
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

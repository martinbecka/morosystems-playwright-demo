import { test, expect } from 'playwright/test';
import { shortPaths, simplePaths } from '../../../../models/tasks.model';

const getTaskStateBeforeEvent = (
  path: (typeof shortPaths)[number],
  eventType: string,
  occurrence = 1,
) => {
  let state = 'empty';
  let count = 0;

  for (const step of path.steps) {
    if (step.event.type === eventType) {
      count++;

      if (count === occurrence) {
        return state;
      }
    }
    state = step.state.value as string;
  }
  return undefined;
};

const getTaskId = (path: (typeof shortPaths)[number], taskIds: string[], eventType: string) => {
  const state = getTaskStateBeforeEvent(path, eventType);

  if (state === 'empty') {
    return 'non-existent-task-id';
  }

  const taskId = taskIds.at(-1);

  expect(taskId).toBeDefined();

  return taskId;
};

const runTasksMbt = (paths: typeof shortPaths) => {
  for (const path of paths) {
    test(path.description, async ({ request }) => {
      const taskIds: string[] = [];
      let taskText = path.description;
      let updateCount = 0;

      await path.test({
        events: {
          CREATE: async () => {
            const response = await request.post('/tasks', {
              data: {
                text: path.description,
              },
            });

            await expect(response).toBeOK();

            const task = await response.json();

            expect(task).toEqual({
              id: expect.any(String),
              text: taskText,
              completed: false,
              createdDate: expect.any(Number),
            });

            taskIds.push(task.id);
          },

          COMPLETE: async () => {
            const taskId = getTaskId(path, taskIds, 'COMPLETE');

            const state = getTaskStateBeforeEvent(path, 'COMPLETE');

            const response = await request.post(`/tasks/${taskId}/complete`);

            if (state === 'empty') {
              expect(response.status()).toBe(404);
              return;
            }

            await expect(response).toBeOK();

            const task = await response.json();

            expect(task).toEqual({
              id: taskId,
              text: taskText,
              completed: true,
              createdDate: expect.any(Number),
              completedDate: expect.any(Number),
            });
          },

          INCOMPLETE: async () => {
            const taskId = getTaskId(path, taskIds, 'INCOMPLETE');

            const state = getTaskStateBeforeEvent(path, 'INCOMPLETE');

            const response = await request.post(`/tasks/${taskId}/incomplete`);

            if (state === 'empty') {
              expect(response.status()).toBe(404);
              return;
            }

            await expect(response).toBeOK();

            const task = await response.json();

            expect(task).toEqual({
              id: taskId,
              text: taskText,
              completed: false,
              createdDate: expect.any(Number),
            });
          },

          DELETE: async () => {
            const taskId = getTaskId(path, taskIds, 'DELETE');

            const state = getTaskStateBeforeEvent(path, 'DELETE');

            const response = await request.delete(`/tasks/${taskId}`);

            if (state === 'empty') {
              expect(response.status()).toBe(404);
              return;
            }

            await expect(response).toBeOK();

            expect(await response.text()).toBe('');
          },

          UPDATE: async () => {
            updateCount++;

            const taskId = getTaskId(path, taskIds, 'UPDATE');

            const state = getTaskStateBeforeEvent(path, 'UPDATE', updateCount);

            taskText = 'Updated task';

            const response = await request.post(`/tasks/${taskId}`, {
              data: {
                text: taskText,
              },
            });

            if (state === 'empty') {
              expect(response.status()).toBe(404);
              return;
            }

            await expect(response).toBeOK();

            const task = await response.json();

            if (state === 'completed') {
              expect(task).toEqual({
                id: taskId,
                text: taskText,
                completed: true,
                createdDate: expect.any(Number),
                completedDate: expect.any(Number),
              });
            } else if (state === 'incompleted' || state === 'created') {
              expect(task).toEqual({
                id: taskId,
                text: taskText,
                completed: false,
                createdDate: expect.any(Number),
              });
            } else {
              throw new Error(`Unexpected state before UPDATE: ${state}`);
            }
          },
        },
      });
    });
  }
};

/*
 Execute generated shortest paths that reach a final state
 with the minimum number of transitions
*/
test.describe('minimal coverage', () => {
  runTasksMbt(shortPaths);
});

/*
 Execute all generated paths to a final state (non-cyclic by default),
 allowing different transitions to revisit the same state
*/
test.describe('complete coverage', () => {
  runTasksMbt(simplePaths);
});

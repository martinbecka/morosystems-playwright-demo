/* eslint-disable playwright/no-conditional-expect */

import { test, expect } from '../../../fixtures/tasks.fixture';
import { CreateTask, ResponseError } from '../../../openapi';

test.describe('POST /tasks', () => {
  test('200 - Create task', async ({ api }) => {
    const response = await api.tasksPostRaw({
      createTask: { text: 'string' },
    });

    expect(response.raw.status).toBe(200);

    const task = await response.value();

    expect(task).toEqual({
      id: expect.any(String),
      text: 'string',
      completed: false,
      createdDate: expect.any(Number),
    });
  });

  test('422 - Missing text', async ({ api }) => {
    try {
      await api.tasksPostRaw({
        createTask: {} as CreateTask,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);

      const responseError = error as ResponseError;

      expect(responseError.response.status).toBe(422);
    }
  });
});

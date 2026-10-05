/* eslint-disable playwright/no-conditional-expect */

import { test, expect } from '../../../fixtures/tasks.fixture';
import { ResponseError } from '../../../openapi';

test.describe('POST /tasks/{id}', () => {
  test('200 - Update task', async ({ api }) => {
    const createResponse = await api.tasksPostRaw({
      createTask: { text: 'original text' },
    });

    const task = await createResponse.value();

    const updateResponse = await api.tasksIdPostRaw({
      id: task.id,
      updateTask: { text: 'updated text' },
    });

    expect(updateResponse.raw.status).toBe(200);

    const updatedTask = await updateResponse.value();

    expect(updatedTask).toEqual({
      id: task.id,
      text: 'updated text',
      completed: false,
      createdDate: expect.any(Number),
    });
  });

  test('404 - Wrong Id', async ({ api }) => {
    try {
      await api.tasksIdPostRaw({
        id: 'nonexistent-id-000000',
        updateTask: { text: 'string' },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);

      const responseError = error as ResponseError;

      expect(responseError.response.status).toBe(404);
    }
  });
});

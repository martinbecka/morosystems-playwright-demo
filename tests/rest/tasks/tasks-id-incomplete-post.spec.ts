/* eslint-disable playwright/no-conditional-expect */

import { test, expect } from '../../../fixtures/tasks.fixture';
import { ResponseError } from '../../../openapi';

test.describe('POST /tasks/{id}/incomplete', () => {
  test('200 - Incomplete task', async ({ api }) => {
    const createResponse = await api.tasksPostRaw({
      createTask: { text: 'string' },
    });

    const task = await createResponse.value();

    await api.tasksIdCompletePostRaw({
      id: task.id,
    });

    const incompleteResponse = await api.tasksIdIncompletePostRaw({
      id: task.id,
    });

    expect(incompleteResponse.raw.status).toBe(200);

    const incompleteTask = await incompleteResponse.value();

    expect(incompleteTask).toEqual({
      id: task.id,
      text: 'string',
      completed: false,
      createdDate: expect.any(Number),
    });
  });

  test('404 - Wrong Id', async ({ api }) => {
    try {
      await api.tasksIdIncompletePostRaw({
        id: 'nonexistent-id-000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);

      const responseError = error as ResponseError;

      expect(responseError.response.status).toBe(404);
    }
  });
});

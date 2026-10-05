import { test, expect } from '../../../fixtures/tasks.fixture';

test.describe('GET /tasks', () => {
  test('200 - Returns empty array when no tasks exist', async ({ api }) => {
    const response = await api.tasksGetRaw();

    expect(response.raw.status).toBe(200);

    const tasks = await response.value();

    expect(tasks).toEqual([]);
  });

  test('200 - Returns all tasks', async ({ api }) => {
    await api.tasksPostRaw({
      createTask: { text: 'Task 1' },
    });

    await api.tasksPostRaw({
      createTask: { text: 'Task 2' },
    });

    await api.tasksPostRaw({
      createTask: { text: 'Task 3' },
    });

    const response = await api.tasksGetRaw();

    expect(response.raw.status).toBe(200);

    const tasks = await response.value();

    expect(tasks).toHaveLength(3);

    expect(tasks[0]).toEqual({
      id: expect.any(String),
      text: 'Task 1',
      completed: false,
      createdDate: expect.any(Number),
    });
  });
});

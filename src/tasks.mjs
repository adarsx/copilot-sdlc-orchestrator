export function addTask(tasks, text, createId) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return tasks;
  }

  return [
    ...tasks,
    {
      id: createId(),
      text: trimmedText,
      completed: false,
    },
  ];
}

export function toggleTask(tasks, taskId) {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task,
  );
}

export function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function parseTasks(serialized) {
  const parsed = JSON.parse(serialized);
  if (!Array.isArray(parsed)) {
    throw new TypeError("Saved tasks must be an array.");
  }

  const ids = new Set();
  for (const task of parsed) {
    if (
      task === null ||
      typeof task !== "object" ||
      Array.isArray(task) ||
      typeof task.id !== "string" ||
      task.id.length === 0 ||
      typeof task.text !== "string" ||
      !task.text.trim() ||
      typeof task.completed !== "boolean" ||
      ids.has(task.id)
    ) {
      throw new TypeError("Saved task data has an invalid shape.");
    }

    ids.add(task.id);
  }

  return parsed.map(({ id, text, completed }) => ({ id, text, completed }));
}

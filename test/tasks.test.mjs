import assert from "node:assert/strict";
import test from "node:test";

import { addTask, deleteTask, parseTasks, toggleTask } from "../src/tasks.mjs";

test("adds a trimmed task with an incomplete state", () => {
  const tasks = addTask([], "  Read a book  ", () => "task-1");

  assert.deepEqual(tasks, [
    { id: "task-1", text: "Read a book", completed: false },
  ]);
});

test("does not add blank input or request an ID", () => {
  const original = [{ id: "task-1", text: "Existing", completed: false }];
  const tasks = addTask(original, " \t\n ", () => {
    assert.fail("Blank input must not create an ID.");
  });

  assert.strictEqual(tasks, original);
});

test("toggles completion without mutating the original task", () => {
  const original = [{ id: "task-1", text: "Read a book", completed: false }];

  const tasks = toggleTask(original, "task-1");

  assert.deepEqual(tasks, [
    { id: "task-1", text: "Read a book", completed: true },
  ]);
  assert.equal(original[0].completed, false);
});

test("deletes only the selected task without mutating the original list", () => {
  const original = [
    { id: "task-1", text: "First", completed: false },
    { id: "task-2", text: "Second", completed: true },
  ];

  const tasks = deleteTask(original, "task-1");

  assert.deepEqual(tasks, [
    { id: "task-2", text: "Second", completed: true },
  ]);
  assert.equal(original.length, 2);
});

test("rejects malformed or duplicate saved tasks", () => {
  assert.throws(() => parseTasks('{"id":"task-1"}'), TypeError);
  assert.throws(
    () =>
      parseTasks(
        '[{"id":"same","text":"First","completed":false},{"id":"same","text":"Second","completed":true}]',
      ),
    TypeError,
  );
});

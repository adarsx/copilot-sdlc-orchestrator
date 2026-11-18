import { addTask, deleteTask, parseTasks, toggleTask } from "./tasks.mjs";

const STORAGE_KEY = "kan-2:tasks:v1";
const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const statusMessage = document.querySelector("#status");

if (!form || !taskInput || !taskList || !statusMessage) {
  throw new Error("Todo app markup is incomplete.");
}

let tasks = [];
let storageUnavailable = false;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.dataset.state = isError ? "error" : "success";
}

function render() {
  if (tasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = storageUnavailable
      ? "Tasks could not be loaded."
      : "No tasks yet.";
    taskList.replaceChildren(emptyState);
    return;
  }

  const items = tasks.map((task) => {
    const item = document.createElement("li");
    item.className = "task-item";

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.dataset.action = "toggle";
    checkbox.dataset.taskId = task.id;

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.className = "button button--delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.taskId = task.id;

    item.append(label, deleteButton);
    return item;
  });

  taskList.replaceChildren(...items);
}

function loadTasks() {
  let serialized;
  try {
    serialized = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    storageUnavailable = true;
    setStatus("Unable to read saved tasks. No changes were made.", true);
    render();
    return;
  }

  if (serialized !== null) {
    try {
      tasks = parseTasks(serialized);
    } catch (error) {
      if (!(error instanceof SyntaxError) && !(error instanceof TypeError)) {
        throw error;
      }

      storageUnavailable = true;
      setStatus("Saved task data is invalid. No changes were made.", true);
    }
  }

  render();
}

function saveTasks(nextTasks, successMessage) {
  if (storageUnavailable) {
    setStatus("Task storage is unavailable. Resolve the issue before changing tasks.", true);
    render();
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
  } catch {
    setStatus("Unable to save tasks. Your current list was not changed.", true);
    render();
    return false;
  }

  tasks = nextTasks;
  render();
  setStatus(successMessage);
  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    setStatus("Enter a task before adding it.", true);
    taskInput.focus();
    return;
  }

  const nextTasks = addTask(tasks, text, () => window.crypto.randomUUID());
  if (saveTasks(nextTasks, "Task added.")) {
    form.reset();
    taskInput.focus();
  }
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement) || checkbox.dataset.action !== "toggle") {
    return;
  }

  saveTasks(toggleTask(tasks, checkbox.dataset.taskId), "Task updated.");
});

taskList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest('button[data-action="delete"]');
  if (!button || !taskList.contains(button)) {
    return;
  }

  saveTasks(deleteTask(tasks, button.dataset.taskId), "Task deleted.");
});

loadTasks();

// The task board's data, kept in memory. Every rule the API enforces lives here.
// Restarting the server puts the board back to the starting tasks.

const COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const STARTING_TASKS = [
  { title: "Sketch the board on paper", column: "done" },
  { title: "Write the API client", column: "doing" },
  { title: "Show the columns and cards", column: "todo" },
  { title: "Add a card", column: "todo" },
  { title: "Move a card", column: "todo" },
];

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function createStore() {
  let tasks = [];
  let nextId = 1;

  function columnExists(id) {
    return COLUMNS.some((c) => c.id === id);
  }

  function inColumn(column) {
    return tasks
      .filter((t) => t.column === column)
      .sort((a, b) => a.position - b.position);
  }

  // Positions in a column always run 0, 1, 2 ... with no gaps.
  function renumber(column) {
    inColumn(column).forEach((t, i) => {
      t.position = i;
    });
  }

  function cleanTitle(title) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new ApiError(400, "Title can't be empty");
    }
    const trimmed = title.trim();
    if (trimmed.length > 200) {
      throw new ApiError(400, "Title is too long (200 characters at most)");
    }
    return trimmed;
  }

  function find(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new ApiError(404, `No task with id ${id}`);
    return task;
  }

  function getBoard() {
    const tasksInOrder = COLUMNS.flatMap((c) => inColumn(c.id));
    return {
      columns: COLUMNS.map((c) => ({ ...c })),
      tasks: tasksInOrder.map((t) => ({ ...t })),
    };
  }

  function addTask(body) {
    const title = cleanTitle(body && body.title);
    const column = body && body.column !== undefined ? body.column : "todo";
    if (!columnExists(column)) throw new ApiError(400, `Unknown column: ${column}`);
    const task = { id: `t${nextId++}`, title, column, position: inColumn(column).length };
    tasks.push(task);
    return { ...task };
  }

  function updateTask(id, body) {
    const task = find(id);
    const changes = body || {};
    const title = changes.title !== undefined ? cleanTitle(changes.title) : task.title;

    const moving = changes.column !== undefined || changes.position !== undefined;
    let column = task.column;
    let position = task.position;
    if (moving) {
      column = changes.column !== undefined ? changes.column : task.column;
      if (!columnExists(column)) throw new ApiError(400, `Unknown column: ${column}`);
      if (changes.position !== undefined) {
        if (!Number.isInteger(changes.position) || changes.position < 0) {
          throw new ApiError(400, "Position must be a whole number, 0 or more");
        }
        position = changes.position;
      } else {
        // Changing column without a position puts the card at the end.
        position = column === task.column ? task.position : Infinity;
      }
    }

    task.title = title;
    if (moving) {
      const from = task.column;
      const others = inColumn(column).filter((t) => t.id !== task.id);
      const at = Math.min(position, others.length);
      others.splice(at, 0, task);
      task.column = column;
      others.forEach((t, i) => {
        t.position = i;
      });
      if (from !== column) renumber(from);
    }
    return { ...task };
  }

  function deleteTask(id) {
    const task = find(id);
    tasks = tasks.filter((t) => t.id !== id);
    renumber(task.column);
  }

  function reset() {
    tasks = [];
    nextId = 1;
    for (const t of STARTING_TASKS) addTask(t);
  }

  reset();
  return { getBoard, addTask, updateTask, deleteTask, reset };
}

module.exports = { createStore, ApiError, COLUMNS };

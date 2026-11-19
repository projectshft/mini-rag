// Board logic: plain functions with no React and no fetch in them.
//
// Every function takes a board and gives back a NEW board. None of them may
// change the board, or the tasks, they were given. React only notices a change
// when it gets a new object, and the tests check that you never edit the old one.
//
// The rules match the server's, so the page and the server always agree:
// - Positions in a column run 0, 1, 2 ... with no gaps.
// - A position past the end of a column means the end. Below 0 means 0.
// - An id that isn't on the board changes nothing.

export type ColumnId = "todo" | "doing" | "done";

export type Column = { id: ColumnId; title: string };

export type Task = {
  id: string;
  title: string;
  column: ColumnId;
  position: number;
};

export type Board = { columns: Column[]; tasks: Task[] };

// The tasks in one column, in position order.
export function tasksIn(board: Board, column: ColumnId): Task[] {
  throw new Error("tasksIn isn't written yet");
}

// Adds a task at the end of its column, whatever position it came with.
export function addTask(board: Board, task: Task): Board {
  throw new Error("addTask isn't written yet");
}

// Moves a task to a column and a position in it, then renumbers.
export function moveTask(board: Board, id: string, column: ColumnId, position: number): Board {
  throw new Error("moveTask isn't written yet");
}

// Gives a task a new title.
export function renameTask(board: Board, id: string, title: string): Board {
  throw new Error("renameTask isn't written yet");
}

// Removes a task and renumbers the column it was in.
export function removeTask(board: Board, id: string): Board {
  throw new Error("removeTask isn't written yet");
}

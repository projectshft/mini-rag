// The API client: the only code in this app that talks to the server.
// Read "The API client contract" in ../README.md before you change this file.
import type { Board, ColumnId, Task } from "./board";

export type TaskChanges = Partial<Pick<Task, "title" | "column" | "position">>;

export type Api = {
  getBoard(): Promise<Board>;
  addTask(title: string, column: ColumnId): Promise<Task>;
  updateTask(id: string, changes: TaskChanges): Promise<Task>;
  deleteTask(id: string): Promise<void>;
};

export function createApi(baseUrl: string, fetchFn: typeof fetch = (...args) => fetch(...args)): Api {
  return {
    async getBoard() {
      throw new Error("getBoard isn't written yet");
    },
    async addTask(title, column) {
      throw new Error("addTask isn't written yet");
    },
    async updateTask(id, changes) {
      throw new Error("updateTask isn't written yet");
    },
    async deleteTask(id) {
      throw new Error("deleteTask isn't written yet");
    },
  };
}

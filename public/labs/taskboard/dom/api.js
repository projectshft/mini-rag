// The API client: the only code in this folder that talks to the server.
// Read "The API client contract" in ../README.md before you change this file.

export function createApi(baseUrl, fetchFn = (...args) => fetch(...args)) {
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

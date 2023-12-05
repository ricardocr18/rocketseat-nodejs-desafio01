import fs from "fs/promises";
import path from "path";

interface Task {
  id: string;
  title: string;
  description: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseStructure {
  tasks: Task[];
}

export class Database {
  private readonly databasePath = path.resolve(
    __dirname,
    "../src/util/db.json"
  );
  #database: DatabaseStructure = { tasks: [] };

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.databasePath, "utf8");
      console.log("Conteúdo do arquivo db.json:", data);
      this.#database = JSON.parse(data) as DatabaseStructure;
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
      await this.#persist();
    }
  }

  async #persist() {
    try {
      await fs.writeFile(
        this.databasePath,
        JSON.stringify(this.#database, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Erro ao escrever no arquivo:", error);
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const data = await fs.readFile(this.databasePath, "utf8");
      const database = JSON.parse(data) as DatabaseStructure;
      return database.tasks;
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
      return [];
    }
  }

  async addTask(newTask: Task): Promise<void> {
    this.#database.tasks.push(newTask);
    await this.#persist();
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    this.#database.tasks = tasks; // Atualiza as tarefas no banco de dados
    await this.#persist(); // Persiste as alterações no arquivo
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskIndex = this.#database.tasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskIndex !== -1) {
      this.#database.tasks.splice(taskIndex, 1);
      await this.#persist();
    }
  }
}

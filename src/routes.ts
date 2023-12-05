import { Request, Response } from "express";
import { Database } from "./database";
import { randomUUID } from "crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: async (req: Request, res: Response) => {
      try {
        const tasks = await database.getTasks();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: async (req: Request, res: Response) => {
      try {
        const { title, description } = req.body;
        const newTask = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await database.addTask(newTask);
        res.status(201).json(newTask);
      } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    },
  },
  {
    method: "PUT",
    path: "/tasks/:id",
    handler: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { title, description } = req.body;
        const tasks = await database.getTasks();
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        const updatedTask = {
          ...tasks[taskIndex],
          title,
          description,
          updated_at: new Date().toISOString(),
        };
        tasks[taskIndex] = updatedTask;
        await database.saveTasks(tasks);
        res.json(updatedTask);
      } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    },
  },
  {
    method: "PATCH",
    path: "/tasks/:id/complete",
    handler: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const tasks = await database.getTasks();
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        const updatedTask = {
          ...tasks[taskIndex],
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        tasks[taskIndex] = updatedTask;
        await database.saveTasks(tasks);
        res.json({ message: "Atividade completada com sucesso!!!", updatedTask });
      } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    },
  },

  {
    method: "DELETE",
    path: "/tasks/:id",
    handler: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const tasks = await database.getTasks();
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        tasks.splice(taskIndex, 1);
        await database.saveTasks(tasks);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    },
  },
  // Adicione aqui as definições das rotas POST, PUT, PATCH, DELETE conforme necessário
];

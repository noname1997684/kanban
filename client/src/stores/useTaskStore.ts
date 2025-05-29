import type { Task, TaskStore } from "@/type/TaskInterface";
import { create } from "zustand";

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  setTasks: (tasks: Task[]) => set({ tasks }),
  getAllTasks: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/task/all");
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await res.json();
      set({ tasks: data.tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (task: Task) => {
    if (!task.title || !task.description) {
      return;
    }
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      set((state) => ({
        tasks: [...state.tasks, data.task],
      }));
      return data.task;
    } catch (error) {
      console.error("Error creating task:", error);
    }
  },
  updateTask: async (taskID: string, task: Task) => {
    try {
      const res = await fetch(`/api/task/${taskID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      const data = await res.json();
      const updatedTask = data.task;
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskID ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },
  deleteTask: async (taskID: string) => {
    try {
      const res = await fetch(`/api/task/${taskID}`, {
        method: "DELETE",
      });
      console.log(res);

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskID),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
  switchList: async (taskID: string, listId: string) => {
    try {
      const res = await fetch(`/api/task/switch/${taskID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId }),
      });

      if (!res.ok) {
        throw new Error("Failed to switch task list");
      }

      const data = await res.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskID ? { ...task, listId } : task
        ),
      }));
    } catch (error) {
      console.error("Error switching task list:", error);
    }
  },
}));

import type { filteredList, List } from "./ListInterface";

export interface Task {
  id?: string;
  title: string;
  description: string;
  listId?: string;
}

export interface CardProps {
  id: string;
  listId?: string;
  title: string;
  description: string;
  filteredLists: filteredList[];
}

export interface CardDialogProps {
  id: string;
  title: string;
  description: string;
  listId?: string;
}

export interface TaskStore {
  tasks: Task[];
  loading: boolean;
  createTask: (task: Task) => Promise<Task>;
  setTasks: (tasks: Task[]) => void;
  getAllTasks: () => Promise<void>;
  updateTask: (taskID: string, task: Task) => Promise<void>;
  deleteTask: (taskID: string) => Promise<void>;
  switchList: (taskID: string, listId: string) => Promise<void>;
}

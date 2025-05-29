import type { Task } from "./TaskInterface";

export interface List {
  id?: string;
  name: string;
  tasks: string[];
}

export interface filteredList {
  id?: string;
  name: string;
  tasks?: Task[];
}
export interface ColumnProps {
  name: string;
  listId?: string;
}

export interface ColumnDialogProps {
  listId?: string;
}

export interface ListStore {
  lists: filteredList[];
  loading: boolean;
  setLists: (
    updater: filteredList[] | ((prev: filteredList[]) => filteredList[])
  ) => void;
  createList: (name: string, boardId: string) => Promise<void>;
  getAllLists: () => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  getListByBoardId: (boardId: string) => Promise<void>;
  updateList: (id: string, name: string) => Promise<void>;
}

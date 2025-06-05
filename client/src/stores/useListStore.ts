import type { ListStore } from "@/type/ListInterface";
import { create } from "zustand";

export const useListStore = create<ListStore>((set) => ({
  lists: [],
  loading: false,
  setLists: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({ lists: updater(state.lists) }));
    } else {
      set({ lists: updater });
    }
  },
  getAllLists: async () => {
    try {
      const res = await fetch("/api/list");
      const data = await res.json();
      set({ lists: data.lists });
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  },
  getListByBoardId: async (boardId: string) => {
    try {
      const res = await fetch(`/api/list/${boardId}`);
      const data = await res.json();
      set({ lists: data.lists });
    } catch (error) {
      console.error("Error fetching lists by board ID:", error);
    }
  },
  createList: async (name: string, boardId: string) => {
    try {
      const res = await fetch("/api/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, boardId }),
      });
      const data = await res.json();

      
      set((state) => ({
        lists: [...state.lists, data.list],
      }));
      return data.list;
    } catch (error) {
      console.error("Error creating list:", error);
    }
  },
  deleteList: async (id: string) => {
    try {
      await fetch(`/api/list/${id}`, {
        method: "DELETE",
      });

      set((state) => ({
        lists: state.lists.filter((list) => list.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  },
  updateList: async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === id ? { ...list, name: data.list.name } : list
        ),
      }));
    } catch (error) {
      console.error("Error updating list:", error);
    }
  }

}));

import type { Board, BoardState } from "@/type/BoardInterface";
import { create } from "zustand";

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  setBoards: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({ boards: updater(state.boards) }));
    } else {
      set({ boards: updater });
    }
  },
  setSelectedBoard: (board: Board) => {
    set(() => ({ selectedBoard: board }));
  },
  getBoardsByUserId: async (userId: string) => {
    try {
      const res = await fetch(`/api/board/${userId}`);
      const data = await res.json();
      set({ boards: data.boards });
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  },
  createBoard: async (name: string, userId: string) => {
    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, userId }),
      });
      const data = await res.json();

      set((state) => ({
        boards: [...state.boards, data.board],
      }));
    } catch (error) {
      console.error("Error creating board:", error);
    }
  },
  updateBoard: async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/board/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === id ? { ...board, name: data.board.name } : board
        ),
      }));
    } catch (error) {
      console.error("Error updating board:", error);
    }
  },
  deleteBoard: async (id: string) => {
    try {
      await fetch(`/api/board/${id}`, {
        method: "DELETE",
      });

      set((state) => ({
        boards: state.boards.filter((board) => board.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  },
}));

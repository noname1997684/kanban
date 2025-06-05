import type { List } from "./ListInterface";

export interface BoardDialogProps {
  boardId?: string;
  name?: string;
}

export interface Board {
  id?: string;
  name: string;
  userId: string;
  lists: List[];
}
export interface BoardCardProps {
  board: Board;
}

export interface BoardState {
    boards: Board[];
    selectedBoard?: Board| null;
    setBoards: (updater: Board[] | ((prev: Board[]) => Board[])) => void;
    getBoardsByUserId: (userId: string) => Promise<void>;
    createBoard: (name: string, userId: string) => Promise<void>;
    setSelectedBoard: (board: Board|null) => void;
    updateBoard: (id: string, name: string) => Promise<Board>;
    deleteBoard: (id: string) => Promise<void>;
    
}
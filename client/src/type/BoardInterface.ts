import type { List } from "./ListInterface";

export interface BoardDialogProps {
  boardId?: string;
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
    selectedBoard?: Board;
    setBoards: (updater: Board[] | ((prev: Board[]) => Board[])) => void;
    getBoardsByUserId: (userId: string) => Promise<void>;
    createBoard: (name: string, userId: string) => Promise<void>;
    setSelectedBoard: (board: Board) => void;
    updateBoard: (id: string, name: string) => Promise<void>;
    deleteBoard: (id: string) => Promise<void>;
    
}
import { Request, Response } from 'express';
import Board from '../models/boardModel';
import User from '../models/userModel';
import List from '../models/listModel';
import { CreateBoardRequest, CreateBoardResponse, DeleteBoardRequest, DeleteBoardResponse, getBoardByUserIdRequest, getBoardByUserIdResponse, UpdateBoardRequest, UpdateBoardResponse } from '../interfaces/controllers/boardInterface';
import { Document, Types} from 'mongoose';

export const getBoardByUserId = async (req:getBoardByUserIdRequest, res:getBoardByUserIdResponse) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const boards = await Board.find({ userId }).populate<{ lists: Document[] }>('lists').exec();

        const formattedBoards = boards.map(board => ({
            id: board._id.toString(),
            name: board.name,
            userId: board.userId.toString(),
            lists: board.lists.map((list) => list._id ? list._id.toString() : list.toString())
        }));

        return res.status(200).json({ boards: formattedBoards });
        

    } catch (error) {
        res.status(500).json({ message: 'Get Board By Id error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const createBoard = async (req:CreateBoardRequest, res:CreateBoardResponse) => {
    try {
        const { name, userId } = req.body;
        const user = await User.findById(userId);
        if (!name || !userId) {
            return res.status(400).json({ message: "Name and userId are required" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const newBoard= new Board({
            name,
            userId,
            lists: [] 
        })
        const savedBoard = await newBoard.save();
        user.boards.push(savedBoard._id);
        await user.save();
        res.status(201).json({ message: "Board created successfully", board: {
            id: savedBoard._id.toString(),
            name: savedBoard.name,
            userId: savedBoard.userId.toString(),
            lists: savedBoard.lists.map(listId => listId.toString())
        } });
    } catch (error) {
        res.status(500).json({ message: 'Create Board error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const updateBoard = async (req:UpdateBoardRequest, res:UpdateBoardResponse) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const board = await Board.findById(id)
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        board.name = name;
        const updatedBoard = await board.save();
        res.status(200).json({ 
            message: "Board updated successfully", 
            board: {
                id: updatedBoard._id.toString(),
                name: updatedBoard.name,
                userId: updatedBoard.userId.toString(),
                lists: updatedBoard.lists.map((listId) => listId.toString())
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Update Board error', error: error instanceof Error ? error.message : String(error) });
    }

}

export const deleteBoard = async (req:DeleteBoardRequest, res:DeleteBoardResponse) => {
    const { id } = req.params;
    try {
        const board = await Board.findByIdAndDelete(id);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        const user = await User.findById(board.userId);
        if (user) {
            user.boards = user.boards.filter(boardId => boardId.toString() !== id);
            await user.save();
        }
        await Promise.all(
            board.lists.map(listsId=> List.findByIdAndDelete(listsId))
        );
        res.status(200).json({ message: "Board deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Delete Board error', error: error instanceof Error ? error.message : String(error) });
    }
}
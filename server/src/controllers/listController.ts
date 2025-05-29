
import List from '../models/listModel';
import { Types } from 'mongoose';
import Task from '../models/taskModel';
import { CreateListRequest, CreateListResponse, DeleteListRequest, DeleteListResponse, GetListByBoardIdRequest, GetListByBoardIdResponse, getListReqest, getListResponse, UpdateListRequest, UpdateListResponse } from '../interfaces/controllers/listInterface';
import Board from '../models/boardModel';



interface ITask {
  _id: Types.ObjectId;
  title: string;
  description: string;
}

export const getAllLists = async (req: getListReqest, res: getListResponse) => {
  try {
    // Gán kiểu populate rõ ràng để TypeScript hiểu tasks là ITask[]
    const lists = await List.find().populate<{ tasks: ITask[] }>('tasks').exec();

    res.status(200).json({
      message: 'Lists retrieved successfully',
      lists: lists.map(list => ({
        id: list._id.toString(),
        name: list.name,
        boardId: list.boardId ? list.boardId.toString() : '', 
        tasks: list.tasks.map(task => ({
          id: task._id.toString(),
          title: task.title,
          description: task.description

        }))
      }))
    });
  } catch (error) {
   res.status(500).json({ message: 'Get All List error', error: error instanceof Error ? error.message : String(error) });
  }
};

export const getListByBoardId = async(req:GetListByBoardIdRequest, res:GetListByBoardIdResponse) => {
    try {
        const { boardId } = req.params;
        if (!boardId) {
            return res.status(400).json({ message: 'Board ID is required' });
        }

        const lists = await List.find({ boardId: new Types.ObjectId(boardId) }).populate<{ tasks: ITask[] }>('tasks').exec();
     
        res.status(200).json({
            message: 'Lists retrieved successfully',
            lists: lists.map(list => ({
                id: list._id.toString(),
                name: list.name,
                boardId: list.boardId ? list.boardId.toString() : '',
                tasks: list.tasks.map(task => ({
                    id: task._id.toString(),
                    title: task.title,
                    description: task.description
                }))
            }))
        });
    } catch (error) {
       res.status(500).json({ message: 'Get List By Board ID error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const createList = async (req: CreateListRequest, res: CreateListResponse) => {
    try {
        const { name,boardId } = req.body;
        if (!name) {
            res.status(404).json({ message: 'Name is required' });
            return;
        }
        if (!boardId) {
            res.status(404).json({ message: 'Board ID is required' });
            return;
        }
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

      const list = new List({
            name,
            tasks: [],
            boardId: new Types.ObjectId(boardId)  
        });
        await list.save();
        board.lists.push(list._id);
        await board.save();
        res.status(201).json({
            message: 'List created successfully',
            list: {
                id: list._id.toString(),
                name: list.name,
               boardId: list.boardId ? list.boardId.toString() : '',
                tasks: list.tasks.map(task => task.toString())
            }
        });
    } catch (error) {
       res.status(500).json({ message: 'Create List error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const updateList = async (req: UpdateListRequest, res: UpdateListResponse) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        list.name = name;
        await list.save();
        res.status(200).json({
            message: 'List updated successfully',
            list: {
                id: list._id.toString(),
                name: list.name,
                boardId: list.boardId ? list.boardId.toString() : '',
                tasks: list.tasks.map(task => task.toString()) 
            }
        });
    } catch (error) {
         res.status(500).json({ message: 'Update List error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const deleteList = async (req: DeleteListRequest, res: DeleteListResponse) => {
    try {
        const { id } = req.params;
        const list = await List.findByIdAndDelete(id);
        const board = await Board.findOne({ lists: id });
        if (board) {
            board.lists = board.lists.filter(listId => listId.toString() !== id);
            await board.save();
        }

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const tasks = list.tasks || [];
        await Promise.all(tasks.map(taskId => Task.findByIdAndDelete(taskId)));

        return res.status(200).json({ message: 'List and associated tasks deleted successfully' });

    } catch (error) {
        console.error('Error deleting list:', error);
         res.status(500).json({ message: 'Delete List error', error: error instanceof Error ? error.message : String(error) });
    }
};


import { Request, Response } from 'express';
import Task from '../models/taskModel';
import { CreateTaskRequest, CreateTaskResponse, GetTasksByListRequest, GetTasksByListResponse } from '../interfaces/controllers/taskInterface';
import List from '../models/listModel';
export const createTask = async (req:CreateTaskRequest, res:CreateTaskResponse) => {
    try {
        const {title, description,listId} = req.body;
        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }
        if (!listId) {
            res.status(400).json({ message: 'List ID is required' });
            return;
        }

        const list = await List.findById(listId);
        if (!list) {
            res.status(404).json({ message: 'List not found' });
            return;
        }
        const newTask = new Task({
            title,
            description,
            listId: list._id
          
        })

        await newTask.save();
        list.tasks.push(newTask._id);
        await list.save();
        res.status(201).json({
            message: 'Task created successfully',
            task: {
                id: newTask._id.toString(),
                title: newTask.title,
                description: newTask.description,
                listId: newTask.listId.toString()
               
            }
        })


        
    } catch (error) {
          res.status(500).json({ message: 'Create Tasks error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const getTasksByList = async (req: GetTasksByListRequest, res: GetTasksByListResponse) => {
    try {
        const {listId} = req.body;
        if (!listId) {
            res.status(400).json({ message: 'Lists query parameter is required' });
            return;
        }
        const tasks = await Task.find({ listId: listId });
        if (tasks.length === 0) {
            res.status(404).json({ message: 'No tasks found with the specified status' });
            return;
        }
        res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks: tasks.map(task => ({
                id: task._id.toString(),
                title: task.title,
                description: task.description,
                listId: task.listId.toString()
               
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Create Tasks error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({});
        if (tasks.length === 0) {
            res.status(404).json({ message: 'No tasks found' });
            return;
        }
        res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks: tasks.map(task => ({
                id: task._id.toString(),
                title: task.title,
                description: task.description,
                listId: task.listId.toString()
                
            }))
        });
    } catch (error) {
        
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { taskId:id } = req.params;
        const { title, description, status } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Task ID is required' });
            return;
        }

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        if (title) task.title = title;
        if (description) task.description = description;
       

        await task.save();

        res.status(200).json({
            message: 'Task updated successfully',
            task: {
                id: task._id.toString(),
                title: task.title,
                description: task.description,
                
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Update Task error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { taskId:id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'Task ID is required' });
            return;
        }
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const list = await List.findById(task.listId);
        if (list) {
            list.tasks = list.tasks.filter(taskId => taskId.toString() !== id);
            await list.save();
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete Task error', error: error instanceof Error ? error.message : String(error) });
    }
}

export const switchList = async (req: Request, res: Response) => {
    try {
        const { taskId:id } = req.params;
        const { listId:newListId } = req.body;

        if (!id || !newListId) {
            res.status(400).json({ message: 'Task ID and new List ID are required' });
            return;
        }

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        const newList = await List.findById(newListId);
        if (!newList) {
            res.status(404).json({ message: 'New List not found' });
            return;
        }

        const oldList = await List.findById(task.listId);
        if (oldList) {
            oldList.tasks = oldList.tasks.filter(taskId => taskId.toString() !== id);
            await oldList.save();
        }

        task.listId = newList._id;
        await task.save();

        newList.tasks.push(task._id);
        await newList.save();

        res.status(200).json({
            message: 'Task moved to new list successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Switch List error', error: error instanceof Error ? error.message : String(error) });
    }
}
import { Router } from "express";
import { createTask,deleteTask,getTasksByList, updateTask,getAllTasks,switchList } from "../controllers/taskController";
const router = Router();

router.post('/', createTask)
router.get('/',getTasksByList)
router.get('/all',getAllTasks),
router.patch('/:taskId',updateTask)
router.delete('/:taskId', deleteTask)
router.patch('/switch/:taskId',switchList)

export default router;
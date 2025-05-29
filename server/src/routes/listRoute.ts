import {Router} from 'express';
import { createList, deleteList, getAllLists, getListByBoardId, updateList } from '../controllers/listController';

const router = Router();
router.get('/', getAllLists)
router.get('/:boardId', getListByBoardId);
router.post('/', createList);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);
export default router;
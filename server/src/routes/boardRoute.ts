import { Router } from "express";
import { createBoard, getBoardByUserId,updateBoard,deleteBoard } from "../controllers/boardController";
const router = Router();

router.get("/:userId",getBoardByUserId);
router.post("/",createBoard);
router.patch("/:id",updateBoard);
router.delete("/:id",deleteBoard);

export default router;
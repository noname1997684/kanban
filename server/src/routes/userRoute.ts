import express from 'express';
import {getUser,registerUser,loginUser,logoutUser} from "../controllers/userController";


const router = express.Router();
router.get('/', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
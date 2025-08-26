import { Router } from "express";
import { deleteUser, getAllUsers, GetMyProfile, login, register } from "../controllers/UserController.js";
import { authenticate, authorizeAdmin } from "../middlewares/Auth.js";

const userRouter = Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/password-reset', () => { })

// authenticated routes
userRouter.get('/profile', authenticate, GetMyProfile)
userRouter.get('/users', authenticate, getAllUsers)
userRouter.put("/profile-update", authenticate, authorizeAdmin, deleteUser)

export default userRouter;
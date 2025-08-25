import { Router } from "express";

const userRouter = Router();

userRouter.post('/register', () => { })
userRouter.post('/login', () => { })
userRouter.post('/password-reset', () => { })

userRouter.get('/user-profile', () => { })
userRouter.put("/profile-update", () => { })

export default userRouter;
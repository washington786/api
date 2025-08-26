import { Router } from "express";
import { deleteUser, getAllUsers, getMyProfile, login, register } from "../controllers/UserController.js";
import { authenticate, authorizeAdmin } from "../middlewares/Auth.js";

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication routes (register, login)
 */

const userRouter = Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/password-reset', () => { })

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management (profile, list, delete) - Admin protected
 */
// authenticated routes
userRouter.use(authenticate);
userRouter.get('/profile', getMyProfile);
userRouter.get('/users', getAllUsers);
userRouter.put("/profile-update", authorizeAdmin, deleteUser);

export default userRouter;
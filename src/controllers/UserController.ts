import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import Users from '../models/Users.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: mysecretpassword
 *           writeOnly: true
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user. Role defaults to 'user'. Admin can't be created via this route.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Users created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal Server Error
 */
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Users already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new Users({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        logger.info(`User registered: ${user.email}`);
        res.status(201).json({ token, user: { _id: user._id, name, email, role: user.role } });
    } catch (err: any) {
        logger.error('Error during registration:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     description: Returns a JWT token and user info on successful login.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mysecretpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        logger.info(`Users logged in: ${user.email}`);
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
        logger.error('Error during login:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's info (name, email, role).
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       401:
 *         description: Unauthorized
 */
export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await Users.findById(req.user?.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Users not found' });
        }
        res.json(user);
    } catch (err: any) {
        logger.error('Error fetching profile:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     description: Only admins can view all users.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *       403:
 *         description: Admin access required
 *       401:
 *         description: Unauthorized
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin access required' });
        }

        const users = await Users.find().select('-password');
        res.json(users);
    } catch (err: any) {
        logger.error('Error fetching users:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     description: Only admins can delete other users.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Users ID
 *     responses:
 *       200:
 *         description: Users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Users deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Users not found
 *       401:
 *         description: Unauthorized
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin access required' });
        }

        const { id } = req.params;
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Users not found' });
        }

        await user.deleteOne();
        logger.info(`Users deleted: ${user.email}`);
        res.json({ msg: 'Users deleted' });
    } catch (err: any) {
        logger.error('Error deleting user:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
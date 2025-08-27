import type { Request, Response } from 'express';
import Issue from '../models/Issue.js';
import logger from '../utils/logger.js';

import { Queue } from 'bullmq';
import { redisClient } from '../configs/redis.js';

const emailQueue = new Queue('email', { connection: redisClient });

/**
 * @openapi
 * /issues:
 *   get:
 *     summary: Get all issues (user: own issues, admin: all issues)
 *     description: Returns a list of issues. Regular users only see their own. Admins see all.
 *     tags:
 *       - Issues
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export const getIssues = async (req: Request, res: Response) => {
    try {
        let query = {};
        if (req.user?.role === 'user') {
            query = { createdBy: req.user.userId };
        }
        const issues = await Issue.find(query).populate('createdBy', 'name email');
        res.json(issues);
    } catch (err: any) {
        logger.error('Error fetching issues:', err);
        res.status(500).json({ msg: err.message });
    }
};

/**
 * @openapi
 * /issues/{id}:
 *   get:
 *     summary: Get a single issue by ID
 *     description: Users can view their own issue. Admins can view any issue.
 *     tags:
 *       - Issues
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: Issue details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       403:
 *         description: Forbidden (user trying to access another user's issue)
 *       404:
 *         description: Issue not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export const getIssueById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id).populate('createdBy', 'name email');

        if (!issue) {
            return res.status(404).json({ msg: 'Issue not found' });
        }

        if (req.user?.role !== 'admin' && issue.createdBy.toString() !== req.user?.userId) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.json(issue);
    } catch (err: any) {
        logger.error('Error fetching issue by ID:', err);
        res.status(500).json({ msg: err.message });
    }
};

/**
 * @openapi
 * /issues/{id}:
 *   put:
 *     summary: Update an issue (only admin or owner can update)
 *     description: Users can update their own issue. Admins can update any issue.
 *     tags:
 *       - Issues
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, 'in-progress', resolved]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Issue not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export const updateIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ msg: 'Issue not found' });
        }

        if (req.user?.role !== 'admin' && issue.createdBy.toString() !== req.user?.userId) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        Object.assign(issue, updates);
        await issue.save();

        res.json(issue);
    } catch (err: any) {
        logger.error('Error updating issue:', err);
        res.status(500).json({ msg: err.message });
    }
};

/**
 * @openapi
 * /issues/{id}:
 *   delete:
 *     summary: Delete an issue (admin only)
 *     description: Only admins can delete issues.
 *     tags:
 *       - Issues
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     responses:
 *       200:
 *         description: Issue deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Issue deleted
 *       403:
 *         description: Forbidden (only admin can delete)
 *       404:
 *         description: Issue not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export const removeIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ msg: 'Issue not found' });
        }

        if (req.user?.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin only: Delete access denied' });
        }

        await issue.deleteOne();
        res.json({ msg: 'Issue deleted' });
    } catch (err: any) {
        logger.error('Error deleting issue:', err);
        res.status(500).json({ msg: err.message });
    }
};

/**
 * @openapi
 * /issues:
 *   post:
 *     summary: Create a new issue
 *     description: Only authenticated users can create issues. Triggers email to admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Login fails on mobile"
 *               description:
 *                 type: string
 *                 example: "User cannot log in using iOS app"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *     tags:
 *       - Issues
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Issue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export const createIssue = async (req: Request, res: Response) => {
    const { title, description, priority } = req.body;
    try {
        const issue = new Issue({
            title,
            description,
            priority,
            createdBy: req.user?.userId,
        });
        await issue.save();

        await emailQueue.add('notifyAdmin', {
            issueId: issue._id,
            title: issue.title,
            userEmail: req.user?.userId,
        });

        res.status(201).json(issue);
    } catch (err: any) {
        logger.error('Error creating issue:', err);
        res.status(500).json({ msg: err.message });
    }
};
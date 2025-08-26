import { Router } from "express";
import { authenticate } from "../middlewares/Auth.js";

const issueRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Issues
 *   description: Manage issue tracking (create, list, update, delete)
 */

issueRouter.use(authenticate);

/* * @openapi
 * /issues:
 *   post:
 *     tags: [Issues]
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
issueRouter.post('/', () => { });

/**
 * @openapi
 * /issues/{id}:
 *   get:
 *     tags: [Issues]
 *     summary: Get issue by ID
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
 */
issueRouter.get('/:id', () => { });

/**
 * @openapi
 * /issues:
 *   get:
 *     tags: [Issues]
 *     summary: Get all issues (user: own, admin: all)
 *     description: Users see only their issues. Admins see all.
 *     responses:
 *       200:
 *         description: List of issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 */
issueRouter.get('/', () => { });



/**
 * @openapi
 * /issues/{id}:
 *   put:
 *     tags: [Issues]
 *     summary: Update an issue
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID
 *     requestBody:
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
 */

issueRouter.put("/:id", () => { });

/**
 * @openapi
 * /issues/{id}:
 *   delete:
 *     tags: [Issues]
 *     summary: Delete an issue
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
 *         description: Admin only
 *       404:
 *         description: Issue not found
 */
issueRouter.delete("/:id", () => { });

export default issueRouter;

/* 

// backend/src/routes/issueRoutes.ts

import { Router } from 'express';
import * as issueController from '../controllers/issueController';
import { authenticate } from '../middleware/auth';

const router = Router();



// 🔒 All issue routes require authentication
router.use(authenticate);

/**
 
router.post('/', issueController.createIssue);


router.get('/', issueController.getIssues);


router.get('/:id', issueController.getIssueById);


router.put('/:id', issueController.updateIssue);


router.delete('/:id', issueController.removeIssue);

export default router; */

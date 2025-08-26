import { Router } from "express";
import { authenticate } from "../middlewares/Auth.js";
import { createIssue, getIssueById, getIssues, removeIssue, updateIssue } from "../controllers/IssueController.js";

const issueRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Issues
 *   description: Manage issue tracking (create, list, update, delete)
 */

issueRouter.use(authenticate);

issueRouter.post('/', createIssue);

issueRouter.get('/:id', getIssueById);

issueRouter.get('/', getIssues);


issueRouter.put("/:id", updateIssue);

issueRouter.delete("/:id", removeIssue);

export default issueRouter;
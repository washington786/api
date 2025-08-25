import { Router } from "express";

const issueRouter = Router();

issueRouter.get('/:id', () => { })
issueRouter.get('/', () => { })

issueRouter.post('/', () => { })


issueRouter.put("/:id", () => { })
issueRouter.delete("/:id", () => { })

export default issueRouter;

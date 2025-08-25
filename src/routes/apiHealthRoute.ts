import { Router } from "express";

const healthRoute = Router();

healthRoute.get('/test', () => { })

export default healthRoute;

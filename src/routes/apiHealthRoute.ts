import { Router } from "express";

const healthRoute = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns OK if service is up
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
healthRoute.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
})

export default healthRoute;
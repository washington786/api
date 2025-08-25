/**
 * @openapi
 * /issues:
 *   get:
 *     summary: Get all issues (user sees own, admin sees all)
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
 */
export const getIssueById = () => { };

/**
 * @openapi
 * /issues:
 *   get:
 *     summary: Get all issues (user sees own, admin sees all)
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
 */
export const getIssues = () => { };
export const removeIssue = () => { };
export const updateIssue = () => { };

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
export const createIssue = () => { };

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from '../utils/swaggerOptions.js';


const swaggerDocs = swaggerJsdoc(swaggerOptions);
const router = Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocs));

export default router;
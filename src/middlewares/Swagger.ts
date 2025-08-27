import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from '../utils/swaggerOptions.js';


const swaggerDocs = swaggerJsdoc(options);
const router = Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocs));

router.get('/', (req, res) => {
    res.redirect('/api-docs');
});

export default router;
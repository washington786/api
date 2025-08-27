import 'dotenv/config';
import express from 'express';
import { connectDB } from './configs/db.js';

import issueRouter from './routes/IssueRoute.js';
import userRouter from './routes/UserRoute.js';
import healthRoute from './routes/apiHealthRoute.js';

import { apiLimiter } from './middlewares/rateLimit.js';

import logger from './utils/logger.js';
import { connectRedis } from './configs/redis.js';
import { startEmailWorker } from './utils/emailWorker.js';
import swagger from './middlewares/Swagger.js';

const app = express();

app.use('/', swagger);

app.use(express.json());
app.use('/api', apiLimiter);

app.use('/api/health', healthRoute);
app.use('/api/auth', userRouter);
app.use('/api/issues', issueRouter);

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    await connectRedis();
    await startEmailWorker();
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
};

start();
import { Worker } from 'bullmq';
import { Resend } from 'resend';
import { redisClient } from '../configs/redis.js';

const resend = new Resend(process.env.RESEND_API_KEY);

new Worker(
    'email',
    async (job) => {
        if (job.name === 'notifyAdmin') {
            const { title, userEmail } = job.data;
            await resend.emails.send({
                from: 'dkmawasha@gmail.com',
                to: 'admin@issues.com',
                subject: `New Issue: ${title}`,
                html: `<p>New issue reported by ${userEmail}: <strong>${title}</strong></p>`,
            });
        }
    },
    // { connection: redisClient }
);
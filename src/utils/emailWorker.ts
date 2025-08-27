import { Worker } from 'bullmq';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const startEmailWorker = async () => {
    try {
        const connection = {
            host: process.env.REDIS_URL || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            ...(process.env.REDIS_USERNAME ? { username: process.env.REDIS_USERNAME } : {}),
            ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
        };

        new Worker(
            'email',
            async (job) => {
                if (job.name === 'notifyAdmin') {
                    const { title, userEmail } = job.data;
                    await resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: 'dkmawasha@gmail.com',
                        subject: `New Issue: ${title}`,
                        html: `<p>New issue reported by ${userEmail}: <strong>${title}</strong></p>`,
                    });
                    console.log(`📧 Email sent for issue: ${title}`);
                }
            },
            { connection }
        );

        console.log('Email worker started, waiting for jobs.');
    } catch (err) {
        console.error('Failed to start email worker:', err);
    }
};
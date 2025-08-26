
import type { Options } from 'swagger-jsdoc';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Issue Tracker API',
            version: '1.0.0',
            description: 'A simple issue tracking API with auth, roles, and background jobs',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}${process.env.API_BASE_PATH || '/api'}`,
            },
        ],
        components: {
            apis: [
                './src/routes/*.ts',
                './src/controllers/*.ts',
            ],
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            Issue: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['open', 'in-progress', 'resolved'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    createdBy: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string' }
                        }
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['user', 'admin'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string', description: 'JWT token' },
                    user: { $ref: '#/components/schemas/User' }
                }
            },
        },
        security: [],
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
    ],
};

export default { SwaggerOptions: options };
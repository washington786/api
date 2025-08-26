FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user (security best practice)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Ensure correct permissions
COPY --chown=nextjs:nodejs . .

USER nextjs

# Expose port
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
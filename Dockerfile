FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the app
COPY . .
RUN npm run build

# 👇 Create logs directory and set ownership
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 👇 Copy only runtime files (logs dir already exists)
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
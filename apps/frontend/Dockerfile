# Development-focused Dockerfile for Next.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose the port the app runs on
EXPOSE 3003

# Add environment variables for development
ENV NODE_ENV=development
ENV FAST_REFRESH=true
ENV WATCHPACK_POLLING=true

# Command to run the app in development mode with better file watching
CMD ["npm", "run", "dev"]
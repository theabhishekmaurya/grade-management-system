# Use Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:dev"]
# Use the latest version from official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Install Redis
RUN apk add --no-cache redis

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables for Redis
ENV REDIS_HOST=127.0.0.1
ENV REDIS_PORT=6379

# Start Redis and Next.js app
CMD redis-server --daemonize yes && npm start

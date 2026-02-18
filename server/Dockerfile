# Dockerfile for Express.js Backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the port (Koyeb will set PORT env variable)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]

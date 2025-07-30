# Use clean base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 8080

# Run app
CMD [ "node", "app.js" ]

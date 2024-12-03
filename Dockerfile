# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Change to client directory, install dependencies and build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --force
COPY client .
RUN npm run build

# Change back to root directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies for the main app
RUN npm install

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]

# Use Node.js 20.15.1 as a parent image
FROM node:20.15.1

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 to be able to map it with the Cloud Run service port
EXPOSE 3000

# Set the command to start the Next.js application
CMD ["npm", "start"]

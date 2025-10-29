# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript code (if using TS)
RUN npm run build

# Expose container port
EXPOSE 3000

# Start React app
CMD ["npm", "start"]

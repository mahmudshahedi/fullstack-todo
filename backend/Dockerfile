# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript (if Nest uses TS)
RUN npm run build

# Expose internal port (not external)
EXPOSE 3000

# Start Nest in dev mode or prod
CMD ["npm", "run", "start:dev"]

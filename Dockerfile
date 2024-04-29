# Stage 1: Build the React app
FROM node:22-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install application dependencies using npm
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built React app using a simple Node.js server
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built app from the previous stage to the working directory
COPY --from=build /app/build ./build

# Install http-server globally to serve static files
RUN npm install -g http-server

# Expose port 80
EXPOSE 80

# Start the Node.js server to serve the app
CMD ["http-server", "build", "-p", "80"]

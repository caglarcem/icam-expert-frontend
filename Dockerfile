FROM node:22-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# Install application dependencies using npm
RUN npm install

# Build the React app
RUN npm run build

EXPOSE 8000

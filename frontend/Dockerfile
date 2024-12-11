# Stage 1: Build the React app
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Set the environment variable for build time
# Accept build argument for REACT_APP_BACKEND_URL
ARG REACT_APP_BACKEND_URL

# Make the build argument available as an environment variable
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL 

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy build output to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port (80 for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

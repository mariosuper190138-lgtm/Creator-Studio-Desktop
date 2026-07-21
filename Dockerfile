# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies in a cached layer
COPY package*.json ./
RUN npm ci

# Copy full application source and build production assets
COPY . .
RUN npm run build

# Stage 2: Production serve stage
FROM nginx:alpine

# Copy built static files to Nginx default html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite default Nginx configuration to support Single Page Application routing and run on Port 3000
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3000 as required by the runtime environment
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

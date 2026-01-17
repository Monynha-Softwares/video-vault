# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Build arguments for Vite environment variables
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_URL

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Export build arguments as environment variables for Vite
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}

# Build the React app for production
# The build output will be in the 'dist' directory
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Add labels for metadata
LABEL maintainer="Monynha Softwares"
LABEL description="Monynha Fun - Video Vault Application"
LABEL version="0.1.5"

WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/* && \
    rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist .

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/index.html || exit 1

# Use non-root user for better security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
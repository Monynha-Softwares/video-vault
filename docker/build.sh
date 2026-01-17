#!/bin/bash

# Build script for Monynha Fun Docker image
# Usage: ./docker/build.sh [--push]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="monynha-fun"
IMAGE_TAG="latest"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${GREEN}=== Monynha Fun Docker Build ===${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo -e "Please start Docker Desktop and try again.\n"
    echo "On Windows:"
    echo "  1. Open Docker Desktop from Start Menu"
    echo "  2. Wait for Docker to start (check system tray icon)"
    echo "  3. Run this script again"
    exit 1
fi

# Check if .env file exists (try .env, then .env.local)
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    if [ -f ".env.local" ]; then
        ENV_FILE=".env.local"
        echo -e "${YELLOW}Using .env.local file${NC}"
    else
        echo -e "${RED}Error: .env or .env.local file not found${NC}"
        echo "Please create a .env file with the following variables:"
        echo "  VITE_SUPABASE_URL"
        echo "  VITE_SUPABASE_PUBLISHABLE_KEY"
        exit 1
    fi
fi

# Load environment variables
echo -e "${YELLOW}Loading environment variables from ${ENV_FILE}...${NC}"
export $(cat "$ENV_FILE" | grep -v '^#' | xargs)

# Validate required variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_PUBLISHABLE_KEY" ]; then
    echo -e "${RED}Error: Missing required environment variables${NC}"
    echo "Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}\n"

# Build Docker image
echo -e "${YELLOW}Building Docker image: ${FULL_IMAGE}${NC}"
docker build \
    --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
    --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY" \
    -t "$FULL_IMAGE" \
    .

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Build successful!${NC}"
    
    # Display image info
    echo -e "\n${YELLOW}Image details:${NC}"
    docker images "$IMAGE_NAME" | head -2
    
    # Check if --push flag was provided
    if [ "$1" == "--push" ]; then
        echo -e "\n${YELLOW}Pushing image to registry...${NC}"
        docker push "$FULL_IMAGE"
        echo -e "${GREEN}✓ Image pushed successfully${NC}"
    else
        echo -e "\n${YELLOW}To run the container:${NC}"
        echo "  docker run -d -p 8080:80 --name monynha-fun $FULL_IMAGE"
        echo -e "\n${YELLOW}Or use Docker Compose:${NC}"
        echo "  docker-compose up -d"
    fi
else
    echo -e "\n${RED}✗ Build failed${NC}"
    exit 1
fi

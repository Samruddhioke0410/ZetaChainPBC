#!/bin/bash

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Start localnet
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Initialize Aptos node
aptos node initialize --local-repository --with-faucet

# Deploy gateway contract
npm run deploy

echo "Localnet setup complete!"

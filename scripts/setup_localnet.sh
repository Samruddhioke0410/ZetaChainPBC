#!/bin/bash

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Create network if it doesn't exist
docker network create zeta-network || true

# Start ZetaChain core services
docker-compose up -d zeta-core observer-node validator-node aptos-node

# Wait for services to be ready
sleep 30

# Initialize Aptos node
aptos node initialize --local-repository --with-faucet

# Deploy gateway contract
npm run deploy:gateway

# Initialize observer-validator setup
npm run init:observers

# Verify setup
npm run verify:setup

# Preliminary build script for development environment

#!/bin/sh

# Ensure we're running sub-scripts from this directory, if called from another
# directory
cd "$(dirname "$0")"

# Initialize git submodules
git submodule init
git submodule update

# Install npm modules to HOST machine
# In the Docker Compose config, these volumes are mounted to the container
# This should ONLY happen during development
cd backend && npm install && cd ../
cd frontend && npm install && cd ../

# Build the Docker Compose configuration
docker-compose build

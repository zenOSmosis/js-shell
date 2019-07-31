# Preliminary build script for development environment

#!/bin/sh

# Ensure we're running sub-scripts from this directory, if called from another
# directory
cd "$(dirname "$0")"

# Initialize git submodules
git submodule init
git submodule update

# Build the Docker Compose configuration
docker-compose build

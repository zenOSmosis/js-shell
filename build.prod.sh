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

# @see https://docs.docker.com/compose/reference/build/
# Usage: build [options] [--build-arg key=val...] [SERVICE...]
# Options:
#    --compress              Compress the build context using gzip.
#    --force-rm              Always remove intermediate containers.
#    --no-cache              Do not use cache when building the image.
#    --pull                  Always attempt to pull a newer version of the image.
#    -m, --memory MEM        Sets memory limit for the build container.
#    --build-arg key=val     Set build-time variables for services.
#    --parallel              Build images in parallel.
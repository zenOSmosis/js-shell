# Preliminary build script for development environment

#!/bin/sh

# Ensure we're running sub-scripts from this directory, if called from another directory
# Absolute path
# @see https://stackoverflow.com/questions/59895/get-the-source-directory-of-a-bash-script-from-within-the-script-itself
ROOT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Initialize git submodules
cd $ROOT_PATH
git submodule init
git submodule update

# Install npm modules to HOST machine
# In the Docker Compose config, these volumes are mounted to the container
# This should ONLY happen during development
cd $ROOT_PATH/backend && npm install
cd $ROOT_PATH/frontend && npm install

# Build the Docker Compose configuration
# TODO: Utilize development Docker Compose configuration
cd $ROOT_PATH
DOCKER_COMPOSE_FILE='docker-compose.dev.yml';
echo "Preparing to build Docker Compose configuration from file ${DOCKER_COMPOSE_FILE}"

USERGROUPID=$(id -u):$(id -g)

CURRENT_UID=${USERGROUPID} docker-compose -f $DOCKER_COMPOSE_FILE build

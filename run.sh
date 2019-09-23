# For a primer on Bash exit traps:
# @see http://redsymbol.net/articles/bash-exit-traps/

#!/bin/bash

UGID=$(id -u):$(id -g)

DOCKER_COMPOSE_FILE='docker-compose.dev.yml';
echo "Preparing to launch Docker Compose configuration from file ${DOCKER_COMPOSE_FILE}"

# Executes the Docker Compose configuration with the current user's process & group id
UGID=${UGID} docker-compose -f $DOCKER_COMPOSE_FILE up

function finish {
  echo "Preparing to remove Docker Compose configuration from file ${DOCKER_COMPOSE_FILE}"

  UGID=${UGID} docker-compose -f $DOCKER_COMPOSE_FILE down
}

trap finish EXIT
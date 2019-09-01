# For a primer on Bash exit traps:
# @see http://redsymbol.net/articles/bash-exit-traps/

#!/bin/bash

# Executes the Docker Compose configuration with the current user's process & group id
CURRENT_UID=$(id -u):$(id -g) docker-compose up

function finish {
  docker-compose down
}

trap finish EXIT
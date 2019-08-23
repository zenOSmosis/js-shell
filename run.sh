#!/bin/sh

# Executes the Docker Compose configuration with the current user's process & group id
CURRENT_UID=$(id -u):$(id -g) docker-compose up

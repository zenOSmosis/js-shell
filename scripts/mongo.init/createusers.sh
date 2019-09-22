#!/usr/bin/env bash
echo "Creating users..."
mongo admin --host localhost -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} --eval "db.createUser({user: '$MONGO_SHELL_USERNAME', pwd: '$MONGO_SHELL_PASSWORD', roles: [{role: 'readWrite', db: '$MONGO_SHELL_DB_NAME'}]});"
echo "Users created."
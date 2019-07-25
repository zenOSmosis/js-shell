#!/bin/sh

# Ensure we're running sub-scripts from this directory, if called from another
# directory
cd "$(dirname "$0")"

./echo-git-branch.sh
./echo-git-short-hash.sh
./echo-git-commit-date.sh

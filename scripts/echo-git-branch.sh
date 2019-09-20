# Echoes the current git branch

#!/bin/sh

git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'

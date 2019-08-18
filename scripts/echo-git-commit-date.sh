# Echoes the current commiter date, RFC2822 style
# @see https://git-scm.com/docs/pretty-formats

#!/bin/sh

git show -s --format=%cD

The bind directory is to be utilized for any symlinks which may share code
between the client and the server.  See socketAPIRoutes.js in this directory
and the bind directory for an example of this (bind/socketAPIRoutes.js is the
symlink).

This can be beneficial for prototyping additional functionality on top of what
is exposed via the server, etc.

For all practical purposes, whatever is inside of the bind directory can be
considered the "common" files between client and server, though their
origination should be from the server.

For run-time information binding, consider using Socket.io API routes or HTTPS.
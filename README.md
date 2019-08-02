| Branch            | Status            |
| ----------------- | ----------------- |
| master | [![Build Status](https://api.travis-ci.com/zenosmosis/js-shell.svg?branch=master)](https://travis-ci.com/zenosmosis/js-shell?branch=master) |


# JS Shell

**Note: This is currently prototype and experimental code; it is not recommended for usage at all right now**

General-purpose, multi-threaded, computing environment for web browsers and tablets, with STDIO bindings into a Node.js server over a Socket.io bridge.

It is like a virtual desktop into a Docker / Linux server, though the desktop is not streamed (only file / data I/O), and the execution context is pure JavaScript.

The Shell GUI frontend will have full local user privileges (and can be elevated) into the Docker / Linux server it is bound to.

## Current Development State

Sloppy.

## TODO: Document frontend / backend components

## TODO: Document architecture

## Building / Running

**Important: Production builds are not currently implemented**

Build instructions are not avialable at this time, however it uses a Docker Compose configuration.

It can be preliminarily spun up by executing:

```bash
# Dependencies
#   - Docker
#   - Docker Compose

# (+) Development Dependencies
#   - Node 10

# ---------------
# If Production
$ ./build.prod.sh

# or...

# If Development
$ ./build.dev.sh
# ---------------

# Running
$ docker-compose up
```

## Optional
The following serve as notes for additional server monitoring, though their API implementations are not currently developed on the server.

### Linux (Ubuntu / Debian) Temperature
In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors

### Linux (Ubuntu / Debian) S.M.A.R.T. Status
To be able to detect S.M.A.R.T. status on Linux you need to install smartmontools. On DEBIAN based linux distributions you can install it by running sudo apt-get install smartmontools

## Motto

To contribute, however slightly, to the commonwealth of all human innovation and experience.

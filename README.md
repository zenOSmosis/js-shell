# JS Shell

**Note: This is currently prototype, and experimental code; it is not recommended for usage at all right now**

General-purpose, multi-threaded, computing environment for web browsers and tablets, with STDIO bindings into a Node.js server over a Socket.io bridge.

It is like a virtual desktop into a Docker / Linux server, though the desktop is not streamed (only file / data I/O), and the execution context is pure JavaScript.

The Shell GUI frontend will have full local user privileges (and can be elevated) into the Docker / Linux server it is bound to.

## Current Development State

Sloppy.

## Building / Running

Build instructions are not avialable at this time, however it uses a Docker Compose configuration.

It can be preliminarily spun up by executing:

```
$ git submodule init
$ git submodule update
$ docker-compose up
```

However, currently, it is all configured for development, and there are no install scripts, so git submodules and npm packages need to manually installed in the relevant directories (e.g. backend / frontend).

Note: One of the git submodules links to a private Bitbucket repository (stt-socket), and is utilized for doing speech-to-text handling.  This particular submodule can be safely ignored for all other functionality.

## Optional

### Linux (Ubuntu / Debian) Temperature
In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors

### Linux (Ubuntu / Debian) S.M.A.R.T. Status
To be able to detect S.M.A.R.T. status on Linux you need to install smartmontools. On DEBIAN based linux distributions you can install it by running sudo apt-get install smartmontools

## Installation / Dependencies

- Ubuntu Linux (Debian / other distros may work, if they use freedesktop architecture)
- Node.js 10+

## Technologies Utilized

### Desktop Environment

- JavaScript (specifically, Node.js 10+)

### Server Environment

- Ubuntu
- Docker

## Motto

To contribute, however slightly, to the commonwealth of all human innovation and experience.

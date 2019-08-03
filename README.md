| Branch            | Status            |
| ----------------- | ----------------- |
| master | [![Build Status](https://api.travis-ci.com/zenosmosis/js-shell.svg?branch=master)](https://travis-ci.com/zenosmosis/js-shell?branch=master) |


# JS Shell

**Note: This is currently prototype and experimental code; it is not recommended for usage at all right now**

General-purpose, multi-threaded, computing environment for web browsers and tablets, with STDIO bindings into a Node.js server over a Socket.io bridge.

It is like a virtual desktop into a Docker / Linux server, though the desktop is not streamed (only file / data I/O), and the execution context is pure JavaScript.

The Shell GUI frontend will have full local user privileges (and can be elevated) into the Docker / Linux server it is bound to.

## Current Development State

Pre-initial prototype.

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

## System Design

### Docker Modules

The {root}/docker_modules directory specifies additional Docker packages which help form the infrastructure of the Shell and its related services.

### Backend

Currently developed with Node 10, run straight from source (not compiled) and supports ES5 require statements.

- Source file compilation: None
- Module import syntax:
  ```
  import package from 'module-name';
  ```

- JS Module path resolution definitions: backend/package.json (_moduleAliases)

### Frontend

Currently developed with Node 10, compiled with WebPack, and supports ES6+ / CommonJS import statements.

- Built on: [Facebook's Create React App](https://github.com/facebook/create-react-app)
- Source file compilation: WebPack
- Additional configuration: frontend/config-overrides.js
- HMR (Hot Module Replacement) supported: Yes
- Module import syntax (ES6+ / CommonJS):
  ```
  const package = require('module-name');
  ```
- JS Module path resolution definitions: frontend/jsonconfig.json (compilerOptions.paths)

Path resolutions:

- TODO: Define "apps"
- TODO: Define "components"
- TODO: Define "core"
- TODO: Define "icons"
- TODO: Define "process"
- TODO: Define "shared"
- TODO: Define "state"
- TODO: Define "utils"

## Optional
The following serve as notes for additional server monitoring, though their API implementations are not currently developed on the server.

### Linux (Ubuntu / Debian) Temperature
In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors

### Linux (Ubuntu / Debian) S.M.A.R.T. Status
To be able to detect S.M.A.R.T. status on Linux you need to install smartmontools. On DEBIAN based linux distributions you can install it by running sudo apt-get install smartmontools

## Motto

To contribute, however slightly, to the commonwealth of all human innovation and experience.

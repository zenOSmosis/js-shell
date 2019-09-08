[![GitHub License](https://img.shields.io/github/license/zenosmosis/js-shell)](https://raw.githubusercontent.com/zenOSmosis/js-shell/master/LICENSE.txt)
[![Build Status](https://travis-ci.com/zenOSmosis/js-shell.svg?branch=master)](https://travis-ci.com/zenOSmosis/js-shell)

# JS Shell

**Note: This is currently prototype, and experimental code; it is not recommended for usage at all right now!**


General-purpose, multi-threaded, computing environment for web browsers and tablets, with STDIO bindings into a Node.js server over a Socket.io bridge.

It is like a virtual desktop into a Docker / Linux server, though the desktop is not streamed (only file / data I/O), and the execution context is pure JavaScript.

The Shell GUI frontend will have full local user privileges (and can be elevated) into the Docker / Linux server it is bound to.

## Multi-Device Testing

We use [BrowserStack](https://www.browserstack.com) to test on a variety of devices and operating systems.

<a href="https://www.browserstack.com" target="_blank"><img src="assets/BrowserStack-logo.svg" alt="BrowserStack" width="320"></a>

## Current Development State

Pre-initial prototype.

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

# Launch
$ ./run.sh
```

## System Design

TODO: Document out further

### Backend

#### Docker Compose

The entire backend environment can be run locally, for development by following the "Building / Running" section above.

#### Nginx (Reverse Proxy / SSL Termination Endpoint)

Nginx is the primary SSL termination endpoint and reverse proxy for https://github.com/zenOSmosis/docker-dev-ssl-proxy in the development environment.

zenOSmosis will be using https://github.com/linuxserver/docker-letsencrypt for production environments.

TODO: Determine if docker-letsencrypt STAGING set to true can replace using docker-dev-ssl-proxy for development, in order to reduce multiple configurations across environments.

#### Docker Modules

The {root}/docker_modules directory specifies additional Docker packages which help form the infrastructure of the Shell and its related services.

#### Node.js Server

Currently developed with Node.js 10, run straight from source (not compiled).

- Source file compilation: None
- Module path resolution definitions: backend/package.json (_moduleAliases)
- Supports ES6+ import w/ Node.js 10 via https://www.npmjs.com/package/esm

### Frontend

Currently developed with Node.js 10, compiled with Webpack.

- Built on: [Facebook's Create React App](https://github.com/facebook/create-react-app)
- Source file compilation: Webpack
- [react-app-rewired](https://github.com/timarney/react-app-rewired) config: frontend/config-overrides.js
- HMR (Hot Module Replacement) supported: Yes
- Module path resolution definitions: frontend/jsonconfig.json (compilerOptions.paths)

Path resolutions:

The following paths make up the various utilities and views which bootstrap the Shell Desktop (UI) environment and related services.

- "apps" (frontend/src/apps): Individual applications which run in the Shell Desktop environment.  Applications typically contain their own set of UI components, though they all use resources from the general "components" below.
- "components" (frontend/src/components): React UI components, most of which are reusable and outside of an application-specific context.
- "config" (frontend/src/config): Configuration for the Shell Desktop.  Any values which may be passed from the environment should be intercepted here and exposed accordingly.
- "core" (frontend/src/core): Core processes and utilties which initialize the Shell and its services.
- "icons" (frontend/src/icons): SVG icons which, when included in components, are compiled into the Shell's JavaScript.
- "process" (frontend/src/process): A set of classes which comprise a forkable virtual process system, with STDIO, and several process extentions which provide STDIO / controller access to native Web Workers, audio and video hardware, etc.
- "shared" (frontend/src/shared): Data structures and code which are shared between server and client.
- "state" (frontend/src/state): A set of classes which provide multi-channeled state management for the Shell Desktop environment.
- "utils" (frontend/src/utils): Utility methods and factory functions for controlling the Shell Desktop environment.  These utilities make simple, programmatic interfaces for controlling all facets of the Shell Desktop environment.

### Naming Conventions

Except where usage of 3rd party libraries is concerned, with their own naming conventions:

- Variable names in camelCase.
  - Class names begin with UpperCase character.
  - Class instances being with lowerCase character.
- Boolean variable / property names prefixed with "is," unless the words "has" or "have" are utilized elsewhere in the name.
- American English spelling variations (e.g. "isSizable" instead of "isSizeable").

## Optional
The following serve as notes for additional server monitoring, though their API implementations are not currently developed on the server.

### Linux (Ubuntu / Debian) Temperature
In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors

### Linux (Ubuntu / Debian) S.M.A.R.T. Status
To be able to detect S.M.A.R.T. status on Linux you need to install smartmontools. On DEBIAN based linux distributions you can install it by running sudo apt-get install smartmontools

## Motto

To contribute, however slightly, to the commonwealth of all human innovation and experience.

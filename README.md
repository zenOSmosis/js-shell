# Shell

A prototype, web-based program launcher, with GPU selector, for Linux.

## Current State

Redundant & messy.

## TODO / Bugs

These are prioritized by importance.

### General

#### High Priority

- [TODO] Decide proper package license; update package.json accordingly.
- [TODO] Implement user account security!
- [TODO] Implement HTTPS encryption for web interface (w/ user account security).
- [TODO] Attribution screen.

#### Medium Priority

- [TODO] Integration of Greenlet (https://www.npmjs.com/package/greenlet) library for client-side, sub-thread processing.
- [TODO] Use shell command from system information, instead of hardcoded "xterm".
- [TODO] Run script which launches backend and frontend, concurrently.
- [TODO] Docker frontend option.
- [TODO] QR connection codes (for each network interface).
- [TODO] Ability to connect client GUI to multiple systems.
- [TODO] Finish implementing system information library.
- [TODO] Navigate and open Chrome bookmarks.
- [TODO] Implement ability to open app with options (e.g. Chrome: Regular / Chrome Incognito Modes).
- [TODO] Implement ability to monitor and close processes.
- [TODO] Include more directories for freedesktop scans (not currently grabbing base Chrome & Firefox apps).
- [TODO] Implement sending of file name (as header) as specified in file request.

#### Low Priority 

- [TODO] Dual desktop
- [TODO] Use logger (e.g. Winston)
- [TODO] Sniffing environment variables of a currently opened program.
- Implement 3D transition library.
- [TODO] Audio mixing (Ubuntu: amixer / pactl / pacmd; https://unix.stackexchange.com/questions/21089/how-to-use-command-line-to-change-volume)
- [TODO] Multimedia controls & viewing
- [TODO] Client microphone capture / server audio redirection.

#### Missing icons

- [TODO] Hard disk icon: https://www.flaticon.com/free-icon/hard-disk_64481#term=disk&page=2&position=10
- [TODO] Network icon

## Features

- Freedesktop.org-based menu parser and automated icon selector.
- Ability to select a GPU to run a program with (if available).
- Ability to launch, and monitor execution of, programs from a phone, tablet, or other computer.

## Optional

### Linux (Ubuntu / Debian) Temperature
In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors

### Linux (Ubuntu / Debian) S.M.A.R.T. Status
To be able to detect S.M.A.R.T. status on Linux you need to install smartmontools. On DEBIAN based linux distributions you can install it by running sudo apt-get install smartmontools

## Installation / Dependencies

- Ubuntu Linux (Debian / other distros may work, if they use freedesktop architecture)
- Node.js 10+

## Technologies Utilized

- JavaScript (specifically, Node.js 10+)

## Motto

To contribute, however slightly, to the commonwealth of all human innovation and experience.
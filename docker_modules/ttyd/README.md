# Docker and ttyd

@see https://hub.docker.com/r/tsl0922/ttyd/

Docker containers are jailed environments which are more secure, this is useful for protecting the host system, you may use ttyd with docker like this:

## Run types

  - Sharing single docker container with multiple clients:
    ```
    $ docker run -it --rm -p 8080:8080 ttyd.
    ```
  - Creating new docker container for each client:
    ```
    $ ttyd docker run -it --rm ubuntu.
    ```

## Run example

```
docker run -it --rm -p 8080:8080 ttyd
```
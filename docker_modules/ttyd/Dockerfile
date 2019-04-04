# @see https://hub.docker.com/r/tsl0922/ttyd/
FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y cmake g++ pkg-config git vim-common libwebsockets-dev libjson-c-dev libssl-dev git
RUN git clone https://github.com/tsl0922/ttyd.git
RUN cd ttyd && mkdir build && cd build && cmake .. && make && make install

ENTRYPOINT ["ttyd", "-p", "8080", "bash", "-x"]
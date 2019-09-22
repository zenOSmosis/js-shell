FROM ubuntu:18.04
LABEL maintainer "jeremy.harris@zenosmosis.com"

RUN apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh \
  && apt-get install -y \
    git \
    htop `#optional` \
    iputils-ping `#optional` \
    nano `#optional` \
    neofetch `#optional` \
    redis-tools `#For Redis administration (optional)` \
    telnet `#optional` \
  && apt-get clean

RUN npm install -g jest mongodb nodemon

# This sets the root password!
# TODO: Make this configurable and do not leave in Dockerfile
RUN echo "root:Docker!" | chpasswd

# TODO: Implement ability to obtain dynamic username
RUN useradd -ms /bin/bash user

WORKDIR /shell/backend

COPY ./ ./

# TODO: Only if in production
# RUN npm install --loglevel verbose --only=prod

EXPOSE 3001

# TODO: Commplete

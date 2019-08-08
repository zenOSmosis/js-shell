FROM ubuntu:18.04
LABEL maintainer="jeremy.harris@zenosmosis.com"

RUN apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh \
  && apt-get clean

# Specifically used during development (TODO: Run from package instead?)
RUN npm install -g nodemon

# TODO: Install user account & don't run as root

WORKDIR /shell/backend

COPY ./ ./

# TODO: Only if in production
# RUN npm install --loglevel verbose --only=prod

EXPOSE 3001

# TODO: Commplete

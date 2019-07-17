FROM node:10

# Specifically used during development (TODO: Run from package instead?)
RUN npm install -g nodemon

WORKDIR /shell/backend

COPY ./ ./

# TODO: Only if in production
# RUN npm install --loglevel verbose --only=prod

EXPOSE 3001

# TODO: Commplete

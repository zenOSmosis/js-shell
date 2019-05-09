FROM node:10

WORKDIR /shell

COPY ./ ./

RUN cd backend && npm install --loglevel verbose && \
    cd ../frontend && npm install --loglevel verbose

# TODO: Commplete

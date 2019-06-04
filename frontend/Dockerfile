FROM node:10

WORKDIR /shell/frontend

COPY ./ ./

RUN npm install --loglevel verbose --only=prod

# In development
EXPOSE 3000

# In production
EXPOSE 5000

# TODO: Commplete
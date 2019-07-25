# TODO: Use node:12
FROM node:10

WORKDIR /shell/frontend

COPY ./ ./

# TODO: Only if in production
# RUN npm install --loglevel verbose --only=prod

# In development
EXPOSE 3000

# In production
EXPOSE 5000

# TODO: Commplete
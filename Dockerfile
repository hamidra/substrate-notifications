FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

# Bundle app source
COPY ./ ./

# install frontend dependancies
WORKDIR /usr/src/app/frontend
RUN yarn install

# install backend dependancies
WORKDIR /usr/src/app/backend
RUN yarn install

ENV HTTP_PORT="80"
ENV HTTPS_PORT="443"

EXPOSE 80
EXPOSE 443

# start fullstack service
WORKDIR /usr/src/app/backend
CMD yarn start:fs | split -b 100k - log- 
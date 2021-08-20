FROM node:16

# install yarn
RUN npm install -g yarn

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

# Bundle app source
COPY ./ ./

ENV HTTP_PORT="80"
ENV HTTPS_PORT="443"

EXPOSE 80
EXPOSE 443

CMD [ "yarn", "start" ]
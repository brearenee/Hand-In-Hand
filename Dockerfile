## built with help from https://dev.to/alexeagleson/docker-for-javascript-developers-41me
# select your base image to start with
FROM node:18-alpine3.18

# Create app directory
# this is the location where you will be inside the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Copy SSL certificate files from the /config directory
COPY $CERT_PATH /usr/src/app
COPY $KEY_PATH /usr/src/app

# Make this port accessible from outside the container
# Necessary for your browser to send HTTP requests to your Node app
EXPOSE 3000

# Command to run when the container is ready
# Separate arguments as separate values in the array
CMD [ "sh", "-c", "npm run migrate && npm run dev-start" ]

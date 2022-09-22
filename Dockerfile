FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

# Bundle app source
COPY src /app/src
COPY .env ./

RUN npm install
RUN npm run build

EXPOSE 8080
CMD [ "node", "./dist/index.js" ]
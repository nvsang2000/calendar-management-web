# Dockerfile
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn install

# COPY
COPY . .

# Build app nextjs
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
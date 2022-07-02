# pull the official base image
FROM node:16
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
RUN npm i
# add app
COPY . ./
# start app
RUN npm run build
RUN npx serve -s build -p 3001

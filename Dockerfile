FROM node:16.16.0-alpine

ARG VITE_PRODUCTION
ARG VITE_SERVER

ENV VITE_PRODUCTION=$VITE_PRODUCTION
ENV VITE_SERVER=$VITE_SERVER

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH


# install app dependencies
COPY package.json ./

COPY package-lock.json ./

RUN npm install -g npm@9.6.5

RUN npm install vite --legacy-peer-deps

# add app
COPY . ./

RUN cp .env.example .env

EXPOSE 5173

# start app
CMD ["npm", "run", "dev", "--", "--host"]

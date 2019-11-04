# https://docs.docker.com/samples/library/node/
ARG NODE_VERSION=12.10.0
# https://github.com/Yelp/dumb-init/releases
ARG DUMB_INIT_VERSION=1.2.2

# Build container
FROM node:${NODE_VERSION}-alpine AS build
ARG DUMB_INIT_VERSION

COPY . /app
WORKDIR /app

RUN apk add --no-cache build-base python2 yarn && \
  wget -O dumb-init -q https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT_VERSION}/dumb-init_${DUMB_INIT_VERSION}_amd64 && \
  chmod +x dumb-init
RUN yarn install && yarn run build && yarn cache clean

# Runtime container
FROM node:${NODE_VERSION}-alpine

RUN apk add bash
WORKDIR /app
COPY --from=build /app /app

COPY ./wait-for-it.sh /usr/local
RUN chmod +x /usr/local/wait-for-it.sh

EXPOSE 3000
CMD ["./dumb-init", "yarn", "start"]

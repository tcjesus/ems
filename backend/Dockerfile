FROM node:20.12-slim

# Owner
LABEL key="Developers <matob@live.com>"

# Enviroment
ARG BUILD_ENV
ENV NODE_ENV=${BUILD_ENV}
ENV TZ=GMT

# Workdir
WORKDIR /root/workspace

# Install Deps
RUN \
  apt-get update && \
  apt-get install curl -y && \
  apt-get -y install procps

# Install
COPY package.json package-lock.json /root/workspace/
RUN npm install

# Timezone
RUN ln -snf "/usr/share/zoneinfo/${TZ}" "/etc/localtime"
RUN echo "${TZ}" > "/etc/timezone"
RUN dpkg-reconfigure -f noninteractive tzdata

#  - - - - - - - - - - This quick hack invalidates the cache - - - - - - - - - - 
ADD https://www.google.com /time.now

# Build the application
COPY . /root/workspace/
COPY ./.env.example /root/workspace/.env
RUN npm run build

# Start Application
COPY ./bin/start.sh /root/workspace/bin/start.sh
ENTRYPOINT [ "/bin/sh", "/root/workspace/bin/start.sh" ]
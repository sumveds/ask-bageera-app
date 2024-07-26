################################
# Stage 1: Build
################################

# Base image
FROM node:19-alpine As builder

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .

# Install app dependencies
RUN npm ci

COPY . .

# Make a build
RUN npm run build:production

################################
# Stage 2: Deploy
################################

FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/src/app/build/ .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

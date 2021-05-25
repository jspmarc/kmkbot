FROM node:lts-alpine3.13

# RUN apk update && apk upgrade
COPY . /bot
WORKDIR /bot
RUN npm i
RUN npx tsc

# CMD ["npm", "run", "start"]
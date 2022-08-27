FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules

ENV MINIO_PORT=9000
ENV MINIO_ENDPOINT=127.0.0.1
ENV MINIO_ACCESS_KEY=root
ENV MINIO_SECRET_KEY=password
ENV MINIO_BUCKET_NAME=bucket


WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000
CMD [ "node", "index.js" ]

FROM alpine:3.5 AS base
RUN apk add --no-cache nodejs-current tini
WORKDIR /root/chat
ENTRYPOINT ["/sbin/tini", "--"]
COPY package.json .
 
FROM base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install
 
FROM base AS release
COPY --from=dependencies /root/chat/prod_node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD npm run start

FROM alpine:3.5 AS base
RUN apk add --no-cache nodejs-current tini
RUN ls
WORKDIR /root/chat
ENTRYPOINT ["/sbin/tini", "--"]
COPY package.json .
 
FROM base AS release
COPY --from=dependencies /root/chat ./chat
COPY . .
RUN ls
RUN apk update
EXPOSE 5000
CMD ps

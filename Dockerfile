# Docker file usefull to serve this UI indepentently if need

FROM nginx:1.19.0-alpine

COPY ./prod /usr/share/nginx/html

FROM node:12 AS compile-image

WORKDIR /opt/ng

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

ENV PATH="./node_modules/.bin:$PATH"
COPY . ./
RUN npm run production
RUN ng lint

FROM nginx
COPY --from=compile-image /opt/ng/dist/dex-frontend /usr/share/nginx/html
COPY ./nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf

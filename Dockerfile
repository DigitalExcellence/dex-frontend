FROM node:12 AS compile-image

WORKDIR /opt/ng

ENV API_URL=''
ENV FRONTEND_URL=''
ENV ID_CALLBACK_URL=''
ENV IDS_URL=''
ENV ID_CLIENT_ID=''
ENV ID_REDIRECT_URI=''
ENV ID_LOGOUT_REDIRECT_URI=''
ENV ID_SILENT_REDIRECT_URI=''
ENV SENTRY_DSN_URL=''

COPY package.json ./
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"
COPY . ./
RUN npm run production
RUN ng lint

FROM nginx
COPY --from=compile-image /opt/ng/dist/dex-frontend /usr/share/nginx/html
COPY ./nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf
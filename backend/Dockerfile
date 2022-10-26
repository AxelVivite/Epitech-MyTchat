FROM node:16.18-alpine
WORKDIR /app/
COPY . .
RUN npm i --omit=dev
CMD npm run start:prod

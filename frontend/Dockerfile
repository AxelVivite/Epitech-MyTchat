FROM node:16.18-alpine as build-stage
WORKDIR /app/
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:16.18-alpine as run-stage
WORKDIR /app/
COPY --from=build-stage /app/build /app
RUN npm i -g serve
CMD serve -s /app

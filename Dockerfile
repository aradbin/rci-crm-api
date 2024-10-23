FROM node:18-alpine as builder

WORKDIR /app/erp-api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app/erp-api

COPY --from=builder /app/erp-api/dist ./

CMD ["npm", "start"]
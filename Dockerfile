FROM node:18-alpine as builder

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build the app
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine
COPY --from=builder /app/dist /usr/src/app

WORKDIR /usr/src/app

CMD ["npm", "start"]
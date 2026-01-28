FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source
COPY . .

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better Docker layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]

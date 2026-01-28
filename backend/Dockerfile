FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .

# Initialize database on startup
EXPOSE 3000
CMD sh -c 'npx ts-node --project tsconfig.json init-db.ts; npx ts-node --project tsconfig.json src/server.ts'
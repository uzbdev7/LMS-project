FROM node:20-alpine AS dependencies
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install
COPY . .
RUN npx prisma generate
RUN pnpm run built
EXPOSE 7070
CMD ["pnpm","run","start:dev"]
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile || bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "server.ts"]

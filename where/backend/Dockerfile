# Use Bun official image
FROM oven/bun:latest

WORKDIR /app

COPY backend/package.json backend/bun.lockb ./

RUN bun install --frozen-lockfile

COPY backend ./

EXPOSE 3000

CMD ["bun", "run", "hono.ts"]


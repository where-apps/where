FROM oven/bun:latest

WORKDIR /app

COPY backend/package.json backend/bun.lock* ./

RUN bun install --frozen-lockfile

COPY backend/ ./

EXPOSE 10000

CMD ["bun", "run", "start"]

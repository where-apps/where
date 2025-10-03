FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

COPY bun.lockb* ./ 

RUN bun install --frozen-lockfile || bun install

COPY . .

RUN bun build hono.ts --outdir dist || true

EXPOSE 3000

# Start

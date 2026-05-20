FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm turbo

COPY package.json turbo.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api/

RUN pnpm --filter @repo/typescript-config run build && \
    pnpm --filter @repo/db run build && \
    pnpm --filter @shanks/sdk run build && \
    pnpm --filter @repo/api run build

EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
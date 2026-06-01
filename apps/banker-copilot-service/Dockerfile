FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bankeros/shared-utils build
RUN pnpm --filter @bankeros/database build
RUN pnpm --filter @bankeros/mcp-bankeros build
RUN pnpm --filter @bankeros/banker-copilot-service build
ENV NODE_ENV=production
EXPOSE 3017
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3017/health || exit 1
CMD ["node", "apps/banker-copilot-service/dist/index.js"]

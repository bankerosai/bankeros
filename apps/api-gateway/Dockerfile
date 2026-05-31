FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bankeros/shared-utils build
RUN pnpm --filter @bankeros/api-gateway build
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "apps/api-gateway/dist/index.js"]

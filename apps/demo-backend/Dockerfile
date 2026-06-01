FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=optional --no-audit --no-fund
COPY src ./src
ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["npx", "tsx", "src/index.ts"]

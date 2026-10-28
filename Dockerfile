# Build frontend
FROM node:20-bookworm-slim AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install
COPY client/ ./
RUN npm run build

# Runtime API (+ static client)
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV CLIENT_DIST=/app/client/dist
ENV UPLOAD_DIR=/data/uploads

COPY server/package.json server/package-lock.json* ./server/
WORKDIR /app/server
RUN npm install --omit=dev
COPY server/ ./
COPY --from=client-build /app/client/dist /app/client/dist

RUN mkdir -p /data/uploads

EXPOSE 3000
CMD ["node", "src/index.js"]

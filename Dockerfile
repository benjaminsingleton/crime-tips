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

# Non-root runtime user (M10). Entrypoint drops privileges after fixing volume perms.
RUN groupadd --gid 10001 crimetips \
  && useradd --uid 10001 --gid crimetips --shell /usr/sbin/nologin --create-home crimetips

COPY server/package.json server/package-lock.json* ./server/
WORKDIR /app/server
RUN npm install --omit=dev
COPY server/ ./
COPY --from=client-build /app/client/dist /app/client/dist

RUN mkdir -p /data/uploads \
  && chown -R crimetips:crimetips /app /data

COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "src/index.js"]

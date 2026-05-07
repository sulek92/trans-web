FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/web/next.config.ts ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/postcss.config.mjs ./apps/web/
COPY packages/ ./packages/
RUN npm ci
COPY apps/web/src ./apps/web/src/
COPY apps/web/public ./apps/web/public/
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx turbo run build --filter=web

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/next.config.ts ./apps/web/
COPY --from=builder /app/apps/web/public ./apps/web/public/
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/ ./packages/
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
USER appuser
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npx", "next", "start", "--port", "3000"]

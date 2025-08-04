FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app
# 设置全局 bin 路径（适用于 Alpine 和 CI 构建）
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
# Replace <your-major-version> with the major version installed in your repository. For example:
RUN pnpm add -g turbo@^2.5.4
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile
# Build the project
COPY --from=builder /app/out/full/ .
#COPY --from=builder /app/apps/web/.env ./apps/web/
#COPY --from=builder /app/packages/database/.env ./packages/database/
ARG NEXT_PUBLIC_ENDPOINT_URL
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_AWS_REGION
ARG NEXT_PUBLIC_AWS_S3_BUCKET_NAME

ENV NEXT_PUBLIC_ENDPOINT_URL=$NEXT_PUBLIC_ENDPOINT_URL
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ENV NEXT_PUBLIC_AWS_REGION=$NEXT_PUBLIC_AWS_REGION
ENV NEXT_PUBLIC_AWS_S3_BUCKET_NAME=$NEXT_PUBLIC_AWS_S3_BUCKET_NAME

RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js

FROM node:22-alpine AS base

# 使用 pnpm（推荐用 corepack 管理）
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- builder stage ----
FROM base AS builder
WORKDIR /app

# 设置全局 bin 路径（适用于 Alpine 和 CI 构建）
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
# 安装 turbo CLI
RUN pnpm add -g turbo@^2.5.4

# 拷贝全部项目并执行 prune
COPY . .
RUN turbo prune api --docker

# ---- installer stage ----
FROM base AS installer
WORKDIR /app

# 拷贝精简后的包管理文件
COPY --from=builder /app/out/json/ .

# 安装依赖
RUN pnpm install --frozen-lockfile

# 拷贝完整源码（仅包括 api 所依赖部分）
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/.env ./apps/api/.env
COPY --from=builder /app/.env ./apps/web/.env
COPY --from=builder /app/.env ./packages/database/.env

# 构建 NestJS 应用
RUN pnpm turbo run build

# ---- runner stage ----
FROM base AS runner
WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 expressjs && \
    adduser --system --uid 1001 expressjs
USER expressjs

# 拷贝构建后的文件
COPY --from=installer /app .

CMD pnpm turbo run db:migrate:deploy && node apps/api/dist/main.js

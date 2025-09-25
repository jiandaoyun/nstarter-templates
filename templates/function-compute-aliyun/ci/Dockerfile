# syntax=docker/dockerfile:1.7-labs
ARG NODE_IMAGE=node:22.19.0-alpine

# 基础构建环境
FROM ${NODE_IMAGE} as build-env
WORKDIR /var/opt/build
COPY .npmrc package.json ./
RUN npm install


# 构建
FROM build-env as build
COPY . .
RUN npm run build && \
    npm run eslint


# 输出报告
FROM scratch as artifacts
COPY --from=build /var/opt/build/dist ./

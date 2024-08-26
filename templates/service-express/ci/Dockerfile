# syntax=docker/dockerfile:1.7-labs
ARG NODE_IMAGE=node:20.16.0-alpine

# 基础构建环境
FROM ${NODE_IMAGE} AS build-env
WORKDIR /var/app
COPY ./package.json ./package-lock.json ./.npmrc ./
RUN npm install

# 编译
FROM build-env AS compile
ENV NODE_ENV=test
COPY . .
RUN npm run json-schema && \
    npm run build

# 单元测试
FROM compile AS test
RUN npm run eslint:html && \
    npm run test

# 输出报告
FROM scratch AS test-report
COPY --from=test /var/app/lint ./lint
COPY --from=test /var/app/coverage/ ./coverage

# 构建结果输出
FROM compile AS artifacts
# 服务端编译结果
RUN mkdir output && \
    mv ./resources ./dist ./conf.d ./output

# 运行环境容器
FROM ${NODE_IMAGE} AS runtime
WORKDIR /var/app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' \
    /etc/apk/repositories && \
    apk add --no-cache tini

ENV TZ=UTC \
    NODE_ENV=production \
    UV_THREADPOOL_SIZE='128' \
    NODE_OPTIONS='--max_old_space_size=2048'

COPY ./package.json ./package-lock.json ./.npmrc VERSION ./
RUN npm install --production

VOLUME ["/var/app/conf.d"]
EXPOSE 3000

COPY --from=artifacts /var/app/output .

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/local/bin/node", "./server/dist/app.js"]

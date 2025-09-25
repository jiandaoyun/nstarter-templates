# syntax=docker/dockerfile:1.7-labs
ARG NODE_IMAGE=node:22.19.0-alpine

# 基础运行环境
FROM ${NODE_IMAGE} AS base-env

WORKDIR /var/app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' \
    /etc/apk/repositories && \
    apk add --no-cache tini

ENV TZ=UTC \
    NODE_ENV=production \
    UV_THREADPOOL_SIZE='128' \
    NODE_OPTIONS='--max_old_space_size=2048'

COPY ./package.json ./package-lock.json ./.npmrc VERSION ./
COPY --parents modules/*/package.json server/package.json ./

RUN npm install --omit=dev

# 编译
FROM base-env AS compile
ENV NODE_ENV=test

RUN npm install

COPY . .
RUN npm run json-schema && \
    npm run build

# 单元测试
FROM compile AS test
RUN npm run eslint:html && \
    npm run test

# 输出报告
FROM scratch AS test-report
COPY --from=test /var/app/server/lint ./lint
COPY --from=test /var/app/server/coverage/ ./coverage

# 构建结果输出
FROM compile AS artifacts
# 服务端编译结果
RUN mkdir output && \
    mv ./resources ./conf.d ./web ./VERSION ./LICENSE ./output && \
    mv ./modules ./server ./output && \
    rm -rf `ls -d output/modules/*/* | grep -Ev "dist|package.json"` && \
    rm -rf `ls -d output/server/* | grep -Ev "dist|package.json"`

# 运行环境容器
FROM base-env AS runtime

VOLUME ["/var/app/conf.d"]
EXPOSE 3000

COPY --from=artifacts /var/app/output .

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/local/bin/node", "./server/dist/app.js"]

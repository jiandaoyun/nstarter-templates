ARG NODE_IMAGE=node:18.13.0-alpine

# 基础构建环境
FROM ${NODE_IMAGE} as build-env
WORKDIR /var/opt/build
COPY .npmrc package.json package-lock.json ./
RUN npm install

# 代码静态检查
FROM build-env as lint
COPY . .
RUN npm run eslint:html

# 编译
FROM lint as compile
RUN npm run build

# 单元测试
FROM compile as test
RUN npm run test

# 输出报告
FROM scratch as test-report
COPY --from=lint /var/app/lint ./lint
COPY --from=test /var/opt/build/coverage/ ./coverage

# 发布
FROM compile as release
RUN npm publish
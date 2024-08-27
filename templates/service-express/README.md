# {{APP_NAME}}

## 开发说明

#### 开发准备

* 安装依赖

  ```bash
  npm install
  ```

* 编译

  ```bash
  npm run build
  ```

* 运行

  ```bash
  node ./server/dist/app.js --enable-source-maps
  ```

* 更新 JSON Schema

  当工程内的实体对象结构定义 (`src/entities`) 发生修改后，需要手动更新 json-schema 结构描述文文件。

  ```bash
  npm run json-schema
  ```

### 工程目录结构

```text
<project_root>
├── ci/                         # CI 编排
├── conf.d/                     # 配置文件目录
├── server/                     # 服务端模块工程目录
│   ├── src/                    # 服务端源码
│   ├── resources/              # 资源文件
│   ├── test/                   # 单元测试目录
│   ├── tools/                  # 开发工具组件
│   ├── typings/                # 模块内类型定义
│   ├── tsconfig.build.json     # TypeScript 构建配置文件
│   └── tsconfig.json           # TypeScript 开发配置文件 (IDE)
├── modules/                    # 子模块工程目录
├── typings/                    # TypeScript 公共类型定义
├── web/                        # 前端资源目录
├── package.json                # 全局 npm 工作目录配置
├── nx.json                     # nx 配置
├── README.md                   # 工程说明文件
└── LICENSE                     # 许可证文件
```

### 打包构建

* 构建容器镜像

  ```bash
  make docker-build
  ```

* 单元测试

  ```bash
  make docker-test
  ```

----

Made on 🌍 with 💓.

# nstarter-ts-express

基于 Express.js 框架的 `nstarter` 模板工程。

本项目提供了一个采用 MVCS 架构设计的后台工程模板。针对 Typescript 环境。

## 目录结构

```
.
├── template/                   # 模板工程根路径
│   ├── conf.d/                 # 配置文件目录
│   ├── public/                 # Web 公共资源目录
│   │   ├── images/             # 前端图片资源目录
│   │   ├── js/                 # 前端 javascript 脚本目录
│   │   └── css/                # 前端样式资源目录
│   ├── resources/              # 服务端资源文件目录
│   │   │── grpc/               # GRPC proto 结构定义文件
│   │   └── i18n/               # 国际化资源文件
│   ├── src/                    # 工程目录
│   │   ├── components/         # 框架基础组件
│   │   │   ├── lib             # 组件配置定义
│   │   │   │   ├── logger      # 日志收集模块配置
│   │   │   │   └── monitor     # 监控模块配置
│   │   │   └── before.ts       # 组件启动前置加载项管理
│   │   ├── constants/          # 常量定义
│   │   ├── entities/           # 实体对象结构定义
│   │   ├── errors/             # 错误异常定义
│   │   ├── models/             # 数据库存储模型定义
│   │   ├── services/           # 业务方法
│   │   ├── controllers/        # 请求处理方法
│   │   ├── routes/             # Express 请求路由表
│   │   │   └── middlewares/    # Express 中间件扩展
│   │   ├── utils/              # 工程内部公用的工具方法
│   │   ├── types/              # 工程内部类型定义
│   │   ├── apm.ts              # APM 探针加载入口
│   │   ├── app.ts              # 应用主程序入口
│   │   ├── config.ts           # 全局配置
│   │   ├── context.ts          # 全局上下文定义
│   │   └── schema.ts           # 结构约束定义 schema 装载入口
│   ├── test/                   # 单元测试
│   ├── tools/                  # 工程维护工具
│   ├── views/                  # Express Web 视图模板
│   ├── config.schema.json      # 配置结构校验 schema
│   ├── tsconfig.json           # Typescript 配置文件
│   ├── .eslintrc.js            # Eslint 规则检查配置文件
│   ├── package.json            # npm 配置文件
│   ├── LICENSE                 # 许可证说明
│   └── README.md               # 工程说明文件
├── package.json                # 模板工程发布配置
├── module.conf.yml             # 模板组件定义配置
└── README.md
```

## 模板工程

更多关于创建 `nstarter` 模板的说明，欢迎查阅相关 [文档](../nstarter/doc/templating.md).


## 许可

[MIT](./LICENSE)

----

Made on 🌍 with 💓.

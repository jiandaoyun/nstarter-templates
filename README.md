# nstarter-template-package

本项目提供了一个采用用于初始化 npm 模块包的 `nstarter` 模板工程。

## 使用方法

```bash
nstarter config set template.npm <repo_url>

nstarter deploy --template npm <target_dir>
```

## 目录结构

```
.
├── template/                   # 模板工程根路径
│   ├── src/                    # 工程目录
│   │   └── index.ts            # npm 包装载入口
│   ├── test/                   # 单元测试
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

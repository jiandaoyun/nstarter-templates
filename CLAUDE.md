## 工程简介

本项目是一套配合 nstarter 这一面向 Node.js + TypeScript 工程开发框架的模板工程，提供的用于快速启动相关类型 Node.js 工程项目的模板化案例，也可以用户对历史工程进行依赖维护升级的管理。

包含的模板：

- `service-express`: Express 服务端工程模板
- `npm-package`: npm 包工程模板
- `function-compute-aliyun`: 阿里云函数计算工程模板


## 工程目录结构

* 模板工程目录结构

  本项目采用 nstarter 2.0 模板工程规范，通过 monorepo 的方式管理多个模板工程，在单个仓库中统一维护不同类型的项目模板。

   ```
   <template-repository>
   ├── package.json                    # 仓库根目录的 npm 包配置
   ├── README.md                       # 仓库说明文档
   ├── LICENSE                         # 许可证文件
   └── templates/                      # 模板集合目录
       ├── service-express/            # Express 服务端工程模板
       ├── npm-package/                # npm 包工程模板
       └── function-compute-aliyun/    # 阿里云函数计算工程模板
   ```

* 单个模板项目内的工程目录结构

   ```
   <project>/                          # 项目模板目录结构
   ├── .ns_template/                   # 模板配置目录
   │   ├── module.conf.yml             # 模块配置文件
   │   └── CHANGELOG.md                # 模板变更日志（可选）
   └── package.json                    # 项目的 npm 包描述文件
   ```


## 模块配置

模板项目在 `.ns_template/` 目录中，应包含一个简单的 `module.conf.yml` 文件，该文件包含以下选项来描述基础项目中的模块。使用模板项目部署时，此模块配置将帮助选择用户想要使用的组件。只有用户选择的相应模块才会被初始化到生成的项目中。

* `module_types`

  `module_types` 定义第一级模块类别，用于对当前模板项目中的不同模块进行分组。

  ```yaml
  module_types:
    - name: basic           # 引用名称
      label: 基础模块           # 显示名称
  ```


* `modules`

  模块是组织模板项目中项目的基本单位。模块定义可以包含*代码/资源文件*、*配置文件*、*模块依赖*等资源描述。例如：

  ```yaml
  modules:
    - name: example         # 当前模块的名称，用作引用标识
      label: 示例模块
      type: basic           # 当前模块的类别，在 `module_types` 中声明
      default: true         # 是否默认启用
      files:                # 仅此模块使用的项目文件路径
        - src/example.ts
      config:               # 当前模块，在模板项目配置文件中定义的配置选项路径
        - server.example
      packages:             # 当前模块所需的 npm 包
        - lodash
      dependencies:         # 此模块所需的其他模板模块的模块名称
        - http
      scripts:              # 当前模板私有的脚本
        - example
  ```


* `ignore_files`

  模板项目也可以在此部分配置部署时要忽略的文件，使用 glob 格式。

  ```yaml
  ignore_files:
    - .git/**
  ```


## 代码模块化

使用自定义模块启动新项目时，被排除模块的实现不应被初始化到项目中。由于模块代码不仅可以在独立的源代码文件中使用，还可以与其他模块一起使用（如在"main"文件中），`nstarter` 提供了声明多个模块代码块的规则。

模块代码块以双斜杠注释行开始，带有 `//#module` 前缀，后跟在 `module.conf.yml` 中声明的模块 `name`。模块代码块以类似的注释行结束，带有 `//#endmodule` 前缀。

此外，模块代码块可以相互嵌套。
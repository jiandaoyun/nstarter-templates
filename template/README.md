

## 函数计算管理工具说明 - funcraft 

阿里云为函数计算本地开发提供了标准化的管理工具 funcraft，推荐使用此工具用于开发，配置管理，以及 CI/CD 发布。

### 工具安装

可以通过 npm 或者二进制包的方式安装 funcraft 工具

```
npm install @alicloud/fun -g
```

具体参考：

https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md


### 环境配置

在工程目录下，创建 `.env` 文件，可以定义函数计算管理工具在使用过程中的相关环境变量参数。相关参数主要涉及 API 调用相关的密钥以及函数计算的区域配置。

```env
ACCOUNT_ID=<account_id>
REGION=cn-hangzhou
ACCESS_KEY_ID=<access_key_id>
ACCESS_KEY_SECRET=<access_key_id>
TIMEOUT=10
RETRIES=3
```

有关更多配置的详细说明，可直接参考 funcraft 官方文档。

注意，本地使用的 `.env` 环境配置不应当被提交到版本控制中，以避免出现密钥泄露的风险。

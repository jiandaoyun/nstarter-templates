# {{APP_NAME}}

## 目录结构

```
.
├── src
│   ├── index.ts        # 函数计算业务调度入口
│   └── types.ts        # 函数计算业务 ts 类型定义
├── .env                # 环境变量定义文件，需自行按需创建
├── Funfile             # funcraft 环境配置文件，类似 Dockerfile
├── package.json        # npm 配置文件
├── README.md           # 说明文件
├── template.yml        # 函数计算服务配置文件
└── tsconfig.json       # typescript 配置文件
```


## 管理工具使用 

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


## 开发说明

* `src/index.ts` - 函数计算服务入口

  业务入口的调用函数方法可以根据实际需要命名为需要的名称，但是需要在调整后，对应调整 `template.yml` 中的入口方法指向。
  
  另外，可以在 index 中提供多个不同的函数调用触发器。不过一般情况对于单一业务调用场景，不建议提供多种入口，而是推荐在单一业务请求中进行二次分发。

* `template.yml` - 函数计算服务配置文件

  此文件中包含了通过 funcraft 发布函数计算服务的配置定义，与阿里云控制台上对函数计算配置一致。需要先配置其中的网络信息，部署角色，日志记录，函数调用入口等相关信息后，再进行发布。funcraft 运行过程调用 API 会通过前面提到的环境变量参数进行鉴权操作。


## 签名认证

由于阿里云函数计算对于 http 触发器同时存在公网与内网的触发调用入口，因而对于调用过程需要开启签名认证的要求，来保证调用的安全性。具体说明可参考阿里云官方相关文档，以及 node.js SDK 中提供的逻辑实现。

- https://help.aliyun.com/document_detail/53252.html
- https://github.com/aliyun/fc-nodejs-sdk/blob/master/lib/client.js#L11

详细的实现，也可以参考以下方法示例：

```typescript
/**
 * 获取 Query 签名
 * @param method - Http 方法
 * @param path - 请求路径
 * @param headers - 请求头
 * @param query - Query
 * @protected
 */
const signQuery = (
    method: Method,
    path: string,
    headers: Record<string, string | number>,
    query: ParsedUrlQueryInput
): string => {
    method = method.toUpperCase() as Method;
    const md5 = headers['Content-MD5'] ?? '';
    const contentType = headers['Content-Type'] ?? '';
    const date = headers['Date'];
    const canonicalHeaders = _
        .chain(headers)
        .reduce((memo: string[], value, key) => {
            const lower = key.toLowerCase().trim();
            if (lower.startsWith('x-fc-')) {
                memo.push(`${ lower }:${ _.toString(value) }`);
            }
            return memo;
        }, [])
        .sort()
        .join('\n')
        .value();
    const pathUnescaped = decodeURIComponent(url.parse(path).pathname ?? '');
    const plain = _
        .chain(query)
        .map((value, key) => Array.isArray(value)
            ? _.map(value, (value) => `${ key }=${ _.toString(value) }`)
            : `${ key }=${ _.toString(value) }`)
        .flatten()
        .sort()
        .thru((value) => _.concat([
            method, md5, contentType, date, canonicalHeaders, pathUnescaped
        ], value))
        .join('\n')
        .thru((value) => `${ value }\n`)
        .value();
    const signature = crypto
        .createHmac('sha256', this.accessKeySecret)
        .update(plain, 'utf8')
        .digest()
        .toString('base64');
    return `FC ${ this.accessKeyId }:${ signature }`;
}
```

----

Made on 🌍 with 💓.


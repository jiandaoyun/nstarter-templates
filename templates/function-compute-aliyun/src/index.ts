import { AliyunServerlessHttpContext, AliyunServerlessHttpRequest, AliyunServerlessHttpResponse } from './types';
import getRawBody from 'raw-body';


/**
 * 函数计算 http 触发器请求调用入口
 * @param req - 阿里云 Serverless Http 请求封装
 * @param res - 阿里云 Serverless Http 请求响应
 * @param context - 请求上下文
 */
export async function run(
    req: AliyunServerlessHttpRequest,
    res: AliyunServerlessHttpResponse,
    context: AliyunServerlessHttpContext
): Promise<void> {
    try {
        const contentLength = req.headers['content-length'];
        const body = JSON.parse(await getRawBody(req, {
            length: contentLength,
            limit: '64kb',
            encoding: 'utf-8'
        }));

        // todo 实现函数计算业务过程逻辑
        const responseBody = {}

        res.setStatusCode(200);
        res.setHeader('content-type', 'application/json');
        return res.send(JSON.stringify({
            ...responseBody,
            aliyun_function_req_id: context.requestId
        }));
    } catch (e) {
        res.setStatusCode(400);
        res.setHeader('content-type', 'application/json');
        return res.send(JSON.stringify({
            code: e.code ?? -1,
            message: e.message
        }));
    }
}

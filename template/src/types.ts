import { EventEmitter } from "events";
import { Readable } from "stream";

/**
 * 阿里云 Serverless Http 上下文
 */
export interface AliyunServerlessHttpContext {
    requestId: string;
    credentials: {
        accessKeyId: string,
        accessKeySecret: string,
        securityToken: string
    };
    function: {
        name: string,
        handler: string,
        memory: number,
        timeout: number,
        initializer: string | undefined,
        initializationTimeout: number
    };
    service: {
        name: string,
        logProject: string,
        logStore: string,
        qualifier: string | undefined,
        versionId: string | undefined
    };
    region: string;
    accountId: string;
    logger: EventEmitter;
    retryCount: number;
}

/**
 * 阿里云 Serverless Http 请求
 */
export interface AliyunServerlessHttpRequest extends Readable {
    headers: Record<string, string>;
    path: string;
    queries: Record<string, string>;
    method: string;
    clientIP: string;
    url: string;
}

/**
 * 阿里云 Serverless Http 响应
 */
export interface AliyunServerlessHttpResponse {
    setStatusCode(
        statusCode: number
    ): void;

    setHeader(
        headerKey: string,
        headerValue: string
    ): void;

    deleteHeader(
        headerKey: string
    ): void;

    send(
        body: string | Buffer | Readable
    ): void;
}

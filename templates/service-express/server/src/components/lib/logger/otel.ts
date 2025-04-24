import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_VERSION, ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { ATTR_HOST_NAME } from '@opentelemetry/semantic-conventions/incubating';
import { format } from 'winston';
import { ContextProvider } from 'nstarter-core';

import { config } from '../../../config';
import { pkg } from '../../../pkg';

// OpenTelemetry 日志跟踪配置
const otelConf = config.system.log.open_telemetry;
const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: pkg.name,
        [ATTR_SERVICE_VERSION]: config.version,
        [ATTR_HOST_NAME]: config.hostname,
        'service_env': config.env
    })
});

// 请求头参数处理
const headers: Record<string, string> = {
    ...otelConf?.headers
};
if (otelConf?.token) {
    headers['Authorization'] = `Basic ${ otelConf.token }`;
}

loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(
        new OTLPLogExporter({
            url: otelConf?.endpoint,
            headers,
            concurrencyLimit: 1,
        })
    )
);

if (otelConf?.enabled) {
    // 全局注册
    logs.setGlobalLoggerProvider(loggerProvider);
}

/**
 * 获取用于 winston 的日志格式化方法
 * @param logger - 日志类型
 */
const getOTelTransportFormat = (logger: string) => {
    return format((info) => {
        info.logger = logger;
        const context = ContextProvider.getContext();
        if (context) {
            info.ctx_trace_id = context.traceId;
        }
        if (info.metadata) {
            // 日志预处理，避免生成无限量字段
            const meta = info.metadata as any;
            for (const [key, val] of Object.entries(meta)) {
                if (typeof val === 'object') {
                    meta[key] = JSON.stringify(val);
                }
            }
        }
        return info;
    })();
};

export { getOTelTransportFormat };

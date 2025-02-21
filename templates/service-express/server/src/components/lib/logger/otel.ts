import {
    LoggerProvider,
    BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import * as logsAPI from '@opentelemetry/api-logs';
import { format } from 'winston';

import { config } from '../../../config';
import { ContextProvider } from 'nstarter-core';

const otelConf = config.system.log.open_telemetry;

if (otelConf?.enabled) {
    // OpenTelemetry 日志跟踪配置
    const collectorOptions = {
        url: otelConf?.endpoint,
        headers: {},
        concurrencyLimit: 1,
    };
    if (otelConf?.token) {
        collectorOptions.headers = {
            'Authorization': `Basic ${ otelConf.token }`
        };
    }
    const logExporter = new OTLPLogExporter(collectorOptions);
    const loggerProvider = new LoggerProvider({
        resource: Resource.empty()
    });
    loggerProvider.addLogRecordProcessor(
        new BatchLogRecordProcessor(logExporter)
    );

    // 全局注册
    logsAPI.logs.setGlobalLoggerProvider(loggerProvider);
}

/**
 * 获取用于 winston 的日志格式化方法
 * @param logger - 日志类型
 */
const getOTelTransportFormat = (logger: string) => {
    return format.combine(
        // @see https://opentelemetry.io/docs/specs/otel/logs/data-model/
        format((info) => {
            const context = ContextProvider.getContext();
            info.logger = logger;
            info.hostname = config.hostname;
            info[ATTR_SERVICE_NAME] = 'ns-app';
            info.service = {
                env: config.env,
                version: config.version
            };
            if (context) {
                info.trace_id = context.traceId;
            }
            return info;
        })(),
        format.json()
    );
};

export { getOTelTransportFormat };

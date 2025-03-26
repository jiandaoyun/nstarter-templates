import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { ATTR_HOST_NAME } from '@opentelemetry/semantic-conventions/incubating';

import { ContextProvider } from 'nstarter-core';
import { TraceSDK, NStarterInstrumentation } from 'nstarter-otel-trace';
// import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

import { config } from './config';
import { pkg } from './pkg';

const otelConf = config.system.trace.open_telemetry;

// @note 需要在启动过程的最初阶段进行初始化
export const trace = new TraceSDK({
    traceExporter: new OTLPTraceExporter({
        url: otelConf?.endpoint,
        headers: otelConf?.token ? {
            'Authorization': `Basic ${ otelConf.token }`
        }: {},
        concurrencyLimit: 1,
    }),
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-express': {
                ignoreLayers: [],
                ignoreLayersType: [ ExpressLayerType.MIDDLEWARE ],
                requestHook: (span, info) => {
                    const context = ContextProvider.getContext();
                    if (context) {
                        span.setAttribute('request_id', context.traceId);
                    }
                }
            }
        }),
        new NStarterInstrumentation({
            onSpanStart: (span) => {
                console.log('span');
            }
        })
    ],
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: pkg.name,
        [ATTR_SERVICE_VERSION]: config.version,
        [ATTR_HOST_NAME]: config.hostname,
        'service_env': config.env
    }),
    // @note 生产服务建议启用采样策略，合理控制观测采集资源开销
    // sampler: new TraceIdRatioBasedSampler(0.1),
});

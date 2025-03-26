import _ from 'lodash';
import winston, { format } from 'winston';
import type Transport from 'winston-transport';
import RotateFileTransport from 'winston-daily-rotate-file';
//#module otel_log
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { getOTelTransportFormat } from './otel';
//#endmodule otel_log

import { config } from '../../../config';
import { Consts } from '../../../constants';

export const requestTransports: Transport[] = [];

// 自定义日志格式化方法
const formatter = format.printf((info) =>
    `${ info.timestamp } - [ACCESS] ${ info.message }`);

// 控制台日志记录
const { console: consoleLogConf } = config.system.log;
if (consoleLogConf?.enabled) {
    const formats = [
        format.timestamp(),
        formatter
    ];
    requestTransports.push(new winston.transports.Console({
        level: 'info',
        format: format.combine(...formats)
    }));
}

// 文件日志记录
const { file: fileLogConf } = config.system.log;
if (fileLogConf?.enabled) {
    const baseFileLogOptions = {
        dirname: fileLogConf.dir || './log/',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: fileLogConf.zip || true,
        maxFiles: `${
            _.toInteger(fileLogConf.rotate_days) || Consts.System.DEFAULT_LOG_ROTATE_DAYS
        }d`
    };

    requestTransports.push(new RotateFileTransport({
        ...baseFileLogOptions,
        level: fileLogConf.level,
        filename: 'access_%DATE%.log',
        stream: undefined,
        format: format.combine(
            format.timestamp(),
            formatter
        )
    }));
}

//#module otel_log
const otelConf = config.system.log.open_telemetry;
if (otelConf?.enabled) {
    requestTransports.push(
        new OpenTelemetryTransportV3({
            level: otelConf.level,
            format: getOTelTransportFormat('request')
        })
    );
}
//#endmodule otel_log

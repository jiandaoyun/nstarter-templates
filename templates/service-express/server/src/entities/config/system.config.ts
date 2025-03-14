interface ILogConf {
    /**
     * 是否启用日志记录
     */
    readonly enabled: boolean;

    /**
     * 日志级别
     */
    readonly level: string;
}

interface IConsoleLogConf extends ILogConf {
    /**
     * 开启彩色输出
     */
    readonly colorize?: boolean;
}

interface IFileLogConf extends ILogConf {
    /**
     * 日志输出目录
     */
    readonly dir?: string;

    /**
     *
     */
    readonly zip?: boolean;
    readonly rotate_days?: number;
}

//#module sentry
interface ISentryConf extends ILogConf {
    readonly dsn: string;
}
//#endmodule sentry

//#module otel
interface IOpenTelemetryConf extends ILogConf {
    // 日志跟踪地址
    readonly endpoint: string;

    // 鉴权 token
    readonly token?: string;
}
//#endmodule otel

export interface ISystemConf {
    //#module i18n
    readonly locale: string;
    //#endmodule i18n
    readonly timezone: string;
    readonly log: {
        readonly console?: IConsoleLogConf,
        readonly file?: IFileLogConf,
        //#module sentry
        readonly sentry?: ISentryConf,
        //#endmodule sentry
        //#module otel
        readonly open_telemetry?: IOpenTelemetryConf
        //#endmodule otel
    };
    readonly req_log: {
        readonly enabled: boolean
    };
    //#module monitor
    readonly monitor: {
        readonly port?: number
    };
    //#endmodule monitor
    readonly trusted_proxy: string[];
}

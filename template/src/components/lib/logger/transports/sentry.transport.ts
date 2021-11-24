import _ from 'lodash';
import Transport, { TransportStreamOptions } from 'winston-transport';
import { init, Severity, NodeOptions, withScope, captureException, captureMessage } from '@sentry/node';
import { LEVEL } from 'triple-beam';
import { config } from '../../../../config';

interface SentryTransportOptions extends TransportStreamOptions, NodeOptions {}

const sentryLevelMap: Record<string, Severity> = {
    debug: Severity.Debug,
    info: Severity.Info,
    warn: Severity.Warning,
    error: Severity.Error
};

export class SentryTransport extends Transport {
    private readonly _dsn?: string;

    constructor(options: SentryTransportOptions) {
        super(options);
        this._dsn = options.dsn;
        init({
            dsn: this._dsn,
            release: config.version,
            environment: config.env,
            serverName: config.hostname,
            integrations: (integrations) =>
                // prevent from exit
                // @see https://github.com/getsentry/sentry-javascript/issues/1661#issuecomment-430666925
                integrations.filter((integration) => (
                    integration.name !== 'OnUncaughtException'
                ))
        });
    }

    public log(info: any, callback: Callback): void {
        setImmediate(() => {
            this.emit('logged', info);
        });
        const level = _.get(sentryLevelMap, info[LEVEL], Severity.Error);
        // @see https://github.com/winstonjs/winston#streams-objectmode-and-info-objects
        if (info.error) {
            // error info
            withScope((scope) => {
                scope.setLevel(level);
                captureException(info.error);
            });
        } else {
            // string info
            captureMessage(info.message, level);
        }
        return callback();
    }
}

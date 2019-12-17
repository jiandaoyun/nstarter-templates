import { AbstractComponent } from './abstract.component';
import { logger, reqLogger } from './lib/logger';
import { provideComponent } from '../decorators';

@provideComponent()
export class LoggerComponent extends AbstractComponent {
    private _logger = logger;
    private _reqLogger = reqLogger;

    public get logger() {
        return this._logger;
    }

    public get reqLogger() {
        return this._reqLogger;
    }
}

import { BaseComponent, component, Logger } from 'nstarter-core';
import { RedisConnector } from 'nstarter-redis';

import { config } from '../config';

@component()
export class RedisComponent extends BaseComponent {
    private readonly _redis: RedisConnector;
    private _readyPromise: Promise<void>;
    private _resolveReady: () => void;

    constructor() {
        super();
        this._redis = new RedisConnector(config.storage.redis);
        this._readyPromise = new Promise(resolve => {
            this._resolveReady = resolve;
        });
        this._redis.on('ready', () => {
            this.setReady(true);
            this._resolveReady();
        });
        this._redis.on('error', (err) => {
           Logger.warn(`${ this._name } redis connection error`);
        });
    }

    /**
     * 等待 ready 完成.
     */
    public async waitForReady() {
        if (this.isReady()) {
            return;
        }
        await this._readyPromise;
    }

    public get redis() {
        return this._redis.getClient();
    }

    public async shutdown() {
        this._redis.disconnect();
        this.setReady(false);
    }
}

import { BaseComponent, component } from 'nstarter-core';

import { RedisConnector } from './lib/database/redis.connection';
import { config } from '../config';

@component()
export class RedisComponent extends BaseComponent {
    private readonly _redis: RedisConnector;

    constructor() {
        super();
        this._redis = new RedisConnector(config.storage.redis, this._name);
        this.redis.connect(() => {
            this.redis.on('ready', () => {
                this.setReady(true);
            });
        });
    }

    public get redis() {
        return this._redis.connection;
    }

    public async shutdown() {
        this._redis.connection.disconnect();
    }
}

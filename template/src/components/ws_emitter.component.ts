import SocketIOEmitter, { Emitter } from 'socket.io-emitter';

import { AbstractComponent } from './abstract.component';
import { RedisComponent } from './redis.component';
import { injectComponent, provideComponent } from '../decorators';

@provideComponent()
export class WsEmitterComponent extends AbstractComponent {
    private readonly _emitter: Emitter;

    @injectComponent()
    private _redisComponent: RedisComponent;

    constructor() {
        super();
        const redis = this._redisComponent.redis;
        this._emitter = SocketIOEmitter(redis.connection);
        this.log();
    }

    public get emitter() {
        return this._emitter;
    }
}

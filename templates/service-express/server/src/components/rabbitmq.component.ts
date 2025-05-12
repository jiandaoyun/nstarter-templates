import { BaseComponent, component, Logger } from 'nstarter-core';
import { AmqpConnector, stopQueueConsumers } from 'nstarter-rabbitmq';

import { config } from '../config';

@component()
export class RabbitMqComponent extends BaseComponent {
    private readonly _amqp: AmqpConnector;

    constructor() {
        super();
        this._amqp = new AmqpConnector(config.components.rabbitmq);
    }

    public async init() {
        this._amqp.connection.on('connectFailed', () => {
            Logger.error(`RabbitMQ connection failed`);
        });
        this._amqp.connection.on('disconnect', () => {
            Logger.error(`RabbitMQ connection disconnected`);
        });

        try {
            await this._amqp.connect();
            this.setReady(true);
        } catch (err) {
            Logger.error(`Rabbitmq connection failed`, { err });
        }
    }

    public get amqp(): AmqpConnector {
        return this._amqp;
    }

    public async shutdown() {
        await stopQueueConsumers();
    }
}

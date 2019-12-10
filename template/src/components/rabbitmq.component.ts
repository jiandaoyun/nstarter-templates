import { config } from '../config';
import { AbstractComponent } from './abstract.component';
import { provideComponent } from './container';
import { RabbitMQConnector } from './lib/database/rabbitmq.connection';

@provideComponent()
export class RabbitMQComponent extends AbstractComponent {
    private readonly _rabbitMq: RabbitMQConnector;

    constructor() {
        super();
        this._rabbitMq = new RabbitMQConnector(config.database.rabbitmq);
        this.log();
    }

    public get rabbitmq() {
        return this._rabbitMq;
    }
}

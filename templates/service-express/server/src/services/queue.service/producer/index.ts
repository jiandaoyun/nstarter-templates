import async from 'async';
import { ContextProvider, service } from 'nstarter-core';
import type { RabbitMqProducer } from 'nstarter-rabbitmq';
import { ProducerEvents } from 'nstarter-rabbitmq';

import { demoProducer } from './demo.producer';
//#module monitor
import { monitor } from '../../../components';
//#endmodule monitor

const producerList: RabbitMqProducer<any>[] = [
    demoProducer,
];

/**
 * 绑定生产事件监听
 */
export const listenProducerEvents = (producer: RabbitMqProducer<any>) => {
    const queueName = producer.queue.name;
    producer.on(ProducerEvents.publish, () => {
        //#module monitor
        monitor.incQueueJobCount(queueName, 'publish');
        //#endmodule monitor
    });
};

/**
 * 队列生产者启动方法
 */
export const startQueueProducer = async () => {
    await async.each(producerList, async (producer) => {
        await producer.setup();
        listenProducerEvents(producer);
    });
};

/**
 * 队列业务调用服务
 */
@service()
export class QueueService {
    public async sendNormalMessage(): Promise<void> {
        const context = ContextProvider.getContext();
        return await demoProducer.publish('demo:normal', context);
    }
}

import _ from 'lodash';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage, Options } from 'amqplib';
import AssertExchange = Options.AssertExchange;
import AssertQueue = Options.AssertQueue;
import Publish = Options.Publish;
import Consume = Options.Consume;
import { DefaultConfig, ExchangeType } from './constants';
import { IMessageHandler, IQueuePayload, IQueueMessage } from './types';

/**
 * RabbitMQ 队列基类
 * @class
 */
export abstract class BaseQueue<T> {
    /**
     * 队列配置
     */
    protected abstract queueConfig: {
        name: string,
        routingKey: string,
        options: AssertQueue
    };

    /**
     * 交换器配置
     */
    protected abstract exchangeConfig: {
        name: string,
        type: ExchangeType,
        options: AssertExchange
    };

    protected prefetch = DefaultConfig.Prefetch;

    protected queue: string;
    protected exchange: string;
    protected abstract rabbitMq: AmqpConnectionManager;
    protected _channelWrapper: ChannelWrapper;
    protected _consumerTag: string;

    constructor() {
        this._initChannelWrapper();
    }

    /**
     * 初始化
     * @private
     */
    private _initChannelWrapper() {
        this._channelWrapper = this.rabbitMq.createChannel({
            json: false,
            // 启动、重连加载逻辑
            // 注册到 rabbitMQ 内部的 setups 队列中，启动或重连时调用
            setup: async (channel: ConfirmChannel): Promise<any> => {
                const { queue } = await channel.assertQueue(this.queueConfig.name, this.queueConfig.options);
                this.queue = queue;
                if (this.prefetch) {
                    await channel.prefetch(this.prefetch);
                }
                const { exchange } = await channel.assertExchange(
                    this.exchangeConfig.name, this.exchangeConfig.type, this.exchangeConfig.options
                );
                this.exchange = exchange;
                await channel.bindQueue(queue, exchange, this.queueConfig.routingKey);
            }
        });
    }

    /**
     * 序列化 RabbitMQ 消息
     * @public
     */
    protected async _serializePayload<T>(content: T): Promise<Buffer> {
        return Buffer.from(JSON.stringify(content));
    }

    /**
     * 反序列化 RabbitMQ 消息
     * @public
     */
    protected async _deserializePayload<T>(content: Buffer): Promise<IQueuePayload<T>> {
        let result: IQueuePayload<T>;
        try {
            result = JSON.parse(_.toString(Buffer.from(content)));
        } catch (e) {
            result = {} as any;
        }
        return result;
    }

    /**
     * 订阅队列消息, PUSH 模式
     */
    public async subscribe(
        messageHandler: IMessageHandler<T>,
        options: Consume
    ): Promise<void> {
        await this.waitForSetup();
        return this._channelWrapper
            .addSetup(async(channel: ConfirmChannel) => {
                const { consumerTag } = await channel.consume(
                    this.queue,
                    async (message: ConsumeMessage | null) => {
                        if (!message) {
                            return;
                        }
                        const payload: IQueueMessage<T> = {
                            ...message,
                            content: await this._deserializePayload(message.content)
                        };
                        process.nextTick(() => messageHandler(payload));
                    },
                    options
                );
                this._consumerTag = consumerTag;
            });
    }

    /**
     * 队列任务创建方法
     * @param content
     * @param options
     */
    public async publish(content: IQueuePayload<T>, options: Publish) {
        const payload = await this._serializePayload(content);
        return this._channelWrapper.publish(this.exchange, this.queueConfig.routingKey, payload, options);
    }

    public ack(
        message: IQueueMessage<T>,
        allUpTo?: boolean
    ): void {
        this._channelWrapper.ack(message as any, allUpTo);
    }

    public nack(
        message: IQueueMessage<T>,
        allUpTo?: boolean,
        requeue?: boolean
    ): void {
        this._channelWrapper.nack(message as any, allUpTo, requeue);
    }

    /**
     * 等待队列初始化完成
     * @return {Promise<void>}
     */
    public async waitForSetup(): Promise<void> {
        // @ts-ignore
        return this._channelWrapper.waitForConnect();
    }

    /**
     * 关闭链接
     * @return {Promise<void>}
     */
    public async close(): Promise<void> {
        return this._channelWrapper.close();
    }
}
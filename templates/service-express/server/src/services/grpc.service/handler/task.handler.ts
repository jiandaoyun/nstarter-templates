import _ from 'lodash';
import async from 'async';
import type { ServerWritableStream } from '@grpc/grpc-js';

import { service } from 'nstarter-core';
import { grpcService, grpcStreamingMethod, grpcUnaryMethod } from 'nstarter-grpc';

import type { TaskConf, TaskReply, TaskResult } from '../types';

@grpcService('worker', 'TaskService')
@service()
export class TaskHandlerService {
    /**
     * gRPC 单参数调用服务端示例
     * @param conf
     */
    @grpcUnaryMethod()
    public async runTask(conf: TaskConf): Promise<TaskResult> {
        const { job } = conf;
        return {
            status: 'ok',
            result: job
        };
    }

    /**
     * gRPC 流式调用服务端示例
     * @param conf
     * @param call
     */
    @grpcStreamingMethod()
    public runTaskProgress(conf: TaskConf, call: ServerWritableStream<TaskConf, TaskReply>) {
        const { id, job } = conf;
        async.eachSeries(_.times(11), (idx, callback) => {
            call.write({ message: `${ idx * 10 }% task: #${ id } ${ job }` });
            setTimeout(callback, 200);
        }, () => {
            call.end();
        });
    }
}

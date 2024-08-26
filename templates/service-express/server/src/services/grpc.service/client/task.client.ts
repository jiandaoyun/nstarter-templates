import type { sendUnaryData } from '@grpc/grpc-js';
import { service } from 'nstarter-core';
import type {
    StreamResult
} from 'nstarter-grpc';
import {
    grpcClient,
    grpcUnaryCall,
    grpcStreamingCall
} from 'nstarter-grpc';
import type { TaskConf, TaskReply, TaskResult } from '../types';

@grpcClient('worker', 'TaskService')
@service()
export class TaskClientService {
    @grpcUnaryCall()
    public runTask(conf: TaskConf, callback: sendUnaryData<TaskResult>): void {}

    @grpcStreamingCall()
    public runTaskProgress(conf: TaskConf): StreamResult<TaskReply> {
        return null;
    }
}

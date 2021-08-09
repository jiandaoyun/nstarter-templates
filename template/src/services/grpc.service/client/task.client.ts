import { sendUnaryData } from 'grpc';
import { service } from 'nstarter-core';
import {
    grpcClient,
    grpcUnaryCall,
    grpcStreamingCall,
    StreamResult
} from 'nstarter-grpc';
import { TaskConf, TaskReply, TaskResult } from '../../../types/services/grpc';

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

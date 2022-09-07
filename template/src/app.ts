import { Logger } from 'nstarter-core';
import './schema';
//#module apm
import { apmConnector } from 'nstarter-apm';
import { apm } from './apm';
//#endmodule apm
import { config } from './config';
import {
    //#module mongodb
    mongodbComponent,
    //#endmodule mongodb
    //#module web
    httpServer,
    httpServerComponent,
    //#endmodule web
    //#module monitor
    monitorServer,
    //#endmodule monitor
    //#module ws_server
    wsServer,
    wsServerComponent,
    //#endmodule ws_server
    //#module rabbitmq
    rabbitMqComponent,
    //#endmodule rabbitmq
    //#module redis
    redisComponent,
    //#endmodule redis
    //#module monitor
    monitorComponent,
    //#endmodule monitor
    //#module grpc_server
    grpcServer
    //#endmodule grpc_server
} from './components';
//#module rabbitmq
import { startQueueConsumers } from 'nstarter-rabbitmq';
import { startQueueProducer, loadQueueConsumers } from './services/queue.service';
//#endmodule rabbitmq
//#module cron
import { startCronJobs } from './services/cron.service';
//#endmodule cron
import { CommonUtils } from './utils';
import { Consts } from './constants';

process.on('uncaughtException', (err) => {
    Logger.error(err);
    return false;
});

class AppManager {
    /**
     * 初始化基础组件
     */
    public static async startBaseComponents() {
        //#module mongodb
        await mongodbComponent.init();
        //#endmodule mongodb
    }

    //#module web
    /**
     * Web 服务
     */
    public static startWebService () {
        const port = config.server.http.port;
        httpServer.listen(port);
        httpServer.on('error', (err) => {
            Logger.error(err);
            process.exit(1);
        });
        httpServer.on('listening', () => {
            Logger.info(`App requests listening on：${ port }`);
        });

        process.on('SIGTERM', () => {
            setTimeout(() => {
                Logger.info('calling server close');
                process.exit(0);
            }, 5000);
        });
    }
    //#endmodule web

    //#module grpc_server
    /**
     * Grpc 服务端
     */
    public static startGrpc() {
        const { port } = config.components.grpc.server;
        grpcServer.init().then();
        Logger.info(`Grpc service listening on：${ port }`);
    }
    //#endmodule grpc_server

    //#module monitor
    /**
     * 监控统计服务
     */
    public static startMonitorService() {
        const monitorPort = config.system.monitor.port;
        if (monitorPort) {
            monitorServer.listen(monitorPort);
            monitorServer.on('listening', () => {
                Logger.info(`Monitor requests listening on：${ monitorPort }`);
            });
        }
    }
    //#endmodule monitor

    //#module rabbitmq
    /**
     * 队列服务
     */
    public static startQueueJobs() {
        startQueueProducer().then();
        loadQueueConsumers();
        startQueueConsumers().then();
    }
    //#endmodule rabbitmq

    //#module cron
    /**
     * 定时任务
     */
    public static startCronJobs() {
        startCronJobs();
    }
    //#endmodule cron

    //#module ws_server
    /**
     * Websocket 服务
     */
    public static startWebsocketService() {
        wsServer.start();
    }
    //#endmodule ws_server

    /**
     * 安全关闭服务
     */
    public static async gracefulShutdown() {
        //#module monitor
        monitorComponent.setShutdownState();
        //#endmodule monitor
        // 等待 readinessProbe 进入 fail 状态
        await CommonUtils.sleep(Consts.System.SHUTDOWN_WAIT_MS);
        try {
            // 按顺序停止服务
            //#module web
            await httpServerComponent.shutdown();
            //#endmodule web
            //#module ws_server
            await wsServerComponent.shutdown();
            //#endmodule ws_server
            //#module rabbitmq
            await rabbitMqComponent.shutdown();
            //#endmodule rabbitmq
            //#module mongodb
            await mongodbComponent.shutdown();
            //#endmodule mongodb
            //#module redis
            await redisComponent.shutdown();
            //#endmodule redis
        } catch (err) {
            Logger.error(err);
        } finally {
            process.exit(0);
        }
    }

    /**
     * 监听关闭事件，安全退出
     */
    public static listenShutdownEvent() {
        process.on('SIGTERM', async () => {
            await AppManager.gracefulShutdown();
        });
    }

    public static async start() {
        //#module apm
        apm.isStarted();
        apmConnector.setApmAgent(apm);
        //#endmodule apm

        await AppManager.startBaseComponents();

        //#module rabbitmq
        AppManager.startQueueJobs();
        //#endmodule rabbitmq
        //#module cron
        AppManager.startCronJobs();
        //#endmodule cron
        //#module monitor
        AppManager.startMonitorService();
        //#endmodule monitor
        //#module web
        AppManager.startWebService();
        //#endmodule web
        //#module ws_server
        AppManager.startWebsocketService();
        //#endmodule ws_server
        AppManager.listenShutdownEvent();
        //#module grpc_server
        AppManager.startGrpc();
        //#endmodule grpc_server
    }
}

if (require.main === module) {
    AppManager.start().then();
}

import { ConfigType } from './interface';

// WARNING: THIS IS A DEMO CONFIG FILE. FOR SECURITY REASONS, DO NOT USE THIS
//          FILE TO CONIFG YOUR APPLICATION.
export const baseConf: ConfigType = {
    server: {
        http: {
            port: 3000
        },
        static: {
            views: './views',
            public: './public'
        },
        session: {
            secret: '!passw0rd',
            name: 'SID'
        },
        cookie: {
            secret: '!passw0rd',
            policy: {
                httpOnly: true,
                signed: true,
                secure: false
            }
        }
    },
    database: {
        mongodb: {
            mongod: {
                host: 'localhost',
                port: 27017
            },
            user: 'admin',
            password: '!passw0rd',
            db: 'data'
        },
        redis: {
            name: 'redis',
            host: 'localhost',
            port: 6379,
            password: '!passw0rd'
        }
    },
    system: {
        locale: 'en_us',
        timezone: 'UTC',
        log: {
            console: {
                enabled: true,
                level: 'info',
                colorize: false
            },
            file: {
                enabled: true,
                level: 'info',
                dir: './log/',
                zip: true,
                rotate_days: 14
            },
            graylog: {
                enabled: false,
                level: 'info',
                servers: [{
                    host: 'localhost',
                    port: 12201
                }]
            },
            sentry: {
                enabled: false,
                level: 'warn',
                dsn: ''
            }
        },
        req_log: {
            enabled: true
        }
    },
    components: {
        grpc: {
            server: {
                port: 9050
            },
            clients: [{
                package: 'worker',
                address: 'localhost:9050'
            }]
        }
    }
};

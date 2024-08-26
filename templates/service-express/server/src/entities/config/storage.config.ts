//#module mongodb
import type { IMongodbConfig } from 'nstarter-mongodb';
//#endmodule mongodb

//#module redis
import type { IRedisConfig } from 'nstarter-redis';
//#endmodule redis

export interface IStorageConf {
    //#module mongodb
    readonly mongodb: IMongodbConfig;
    //#endmodule mongodb
    //#module redis
    readonly redis: IRedisConfig;
    //#endmodule redis
}

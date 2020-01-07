import { ValidateFunction } from 'ajv';

import { RunEnv } from 'nstarter-core';
import { Types } from '../entity.ajv';
import { BaseEntity } from '../entity.base';
import { ServerConfig } from './server.config';
import { SystemConfig } from './system.config';
import { DatabaseConfig } from './database.config';
import { ComponentsConfig } from './components.config';
import { IConfig } from '../../types/config';

let validator: ValidateFunction = () => true;

export class ConfigEntity extends BaseEntity<IConfig> {
    protected _validate = validator;

    protected _schema = {
        // Base attributes
        env: Types.string({
            enum: RunEnv,
            default: RunEnv.dev,
            required: true
        }),
        hostname: Types.string({ required: true }),
        version: Types.string({ required: true }),
        home_path: Types.string(),
        // Configurations
        server: Types.object({}, {
            model: ServerConfig,
            required: true
        }),
        database: Types.object({}, {
            model: DatabaseConfig,
            required: true
        }),
        system: Types.object({}, {
            model: SystemConfig,
            required: true
        }),
        components: Types.object({}, {
            model: ComponentsConfig,
            required: true
        })
    };
}

validator = new ConfigEntity().validator;

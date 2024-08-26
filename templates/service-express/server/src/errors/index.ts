import _ from 'lodash';

import type { ErrorBuilder} from 'nstarter-core';
import { NsError, registerErrorMessages } from 'nstarter-core';
import { ErrorTypes, errorMessages } from './err_msgs';

registerErrorMessages(errorMessages);

const errors = {} as any as Record<keyof typeof ErrorTypes, ErrorBuilder>;

type ErrorTypeKeys = keyof typeof ErrorTypes;

// 注册错误生成工厂方法
_.forEach(Object.keys(ErrorTypes) as ErrorTypeKeys[], (errorType: ErrorTypeKeys) => {
    errors[errorType] = (...args) => new NsError(ErrorTypes[errorType], ...args) as Error;
});

export {
    errors as Errors
};

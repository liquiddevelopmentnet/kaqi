"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeout = exports.AxiosConfig = exports.Headers = exports.Hook = exports.ErrorHandler = exports.UrlSuffix = exports.Transient = void 0;
const sharedUtils_1 = require("./sharedUtils");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Transient = (target, methodName) => Object.defineProperty(target[methodName], '_transient', {
    value: true,
    writable: false,
});
exports.Transient = Transient;
const UrlSuffix = (suffix = '') => (0, sharedUtils_1.buildServiceDecorator)({ suffix });
exports.UrlSuffix = UrlSuffix;
const ErrorHandler = (httpStatus, endpoints) => (target, method) => {
    (0, sharedUtils_1.ensureProps)(target, 'errorHandlers');
    target._pre_p_props.errorHandlers[method.toString()] = {
        httpStatus,
        endpoints,
    };
};
exports.ErrorHandler = ErrorHandler;
const Hook = (endpointName) => (target, hookName) => {
    var _a;
    var _b;
    (0, sharedUtils_1.ensureProps)(target, 'hooks');
    (_a = (_b = target._pre_p_props.hooks)[endpointName]) !== null && _a !== void 0 ? _a : (_b[endpointName] = []);
    target._pre_p_props.hooks[endpointName].push(hookName);
};
exports.Hook = Hook;
exports.Headers = {
    Service: (headers) => (0, sharedUtils_1.buildServiceDecorator)({ headers }),
    Method: (headers) => (0, sharedUtils_1.buildMethodDecorator)({ headers }),
};
exports.AxiosConfig = {
    Service: (axiosConfig) => (0, sharedUtils_1.buildServiceDecorator)({ axiosConfig }),
    Method: (axiosConfig) => (0, sharedUtils_1.buildMethodDecorator)({ axiosConfig }),
    // TODO: Request parameter config
};
exports.Timeout = {
    Service: (timeout) => (0, sharedUtils_1.buildServiceDecorator)({ timeout }),
    Method: (timeout) => (0, sharedUtils_1.buildMethodDecorator)({ timeout }),
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMethodDecorator = exports.buildServiceDecorator = exports.ensureProps = void 0;
const ensureProps = (target, field) => {
    var _a;
    var _b;
    (_a = target._pre_p_props) !== null && _a !== void 0 ? _a : (target._pre_p_props = {});
    (_b = target._pre_p_props)[field] || (_b[field] = {});
};
exports.ensureProps = ensureProps;
const ensureEndpoints = (target, endpointName) => {
    var _a;
    var _b;
    (0, exports.ensureProps)(target, 'endpoints');
    (_a = (_b = target._pre_p_props.endpoints)[endpointName]) !== null && _a !== void 0 ? _a : (_b[endpointName] = {});
};
const buildServiceDecorator = (fields) => (target) => {
    for (const field in fields) {
        (0, exports.ensureProps)(target.prototype, field);
        if (typeof fields[field] === 'object')
            Object.assign(target.prototype._pre_p_props[field], fields[field]);
        else
            target.prototype._pre_p_props[field] = fields[field];
    }
};
exports.buildServiceDecorator = buildServiceDecorator;
const buildMethodDecorator = (fields) => (target, endpointName) => {
    var _a;
    var _b;
    ensureEndpoints(target, endpointName);
    for (const field in fields) {
        (_a = (_b = target._pre_p_props.endpoints[endpointName])[field]) !== null && _a !== void 0 ? _a : (_b[field] = {});
        if (typeof fields[field] === 'object')
            Object.assign(target._pre_p_props.endpoints[endpointName][field], fields[field]);
        else
            target._pre_p_props.endpoints[endpointName][field] = fields[field];
    }
};
exports.buildMethodDecorator = buildMethodDecorator;

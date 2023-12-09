"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const axios_1 = __importStar(require("axios"));
const __1 = require("..");
const package_json_1 = require("../../package.json");
class Service {
    constructor(builder) {
        var _a, _b;
        this._g_props = builder;
        this._p_props = (_a = this._pre_p_props) !== null && _a !== void 0 ? _a : { endpoints: {} };
        this._methodMap = this._makeMethodMap();
        this._axios = axios_1.default.create({
            baseURL: (_b = this._g_props.url + this._p_props.suffix) !== null && _b !== void 0 ? _b : '',
        });
        this._methodMap.forEach((_method, name) => {
            this._buildEndpointFunction(name);
            this._injectHooks(name);
        });
    }
    _makeMethodMap() {
        const methodMap = new Map();
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
            var _a, _b, _c, _d;
            const method = this[name];
            if (((_a = Object.getOwnPropertyDescriptor(method, '_transient')) === null || _a === void 0 ? void 0 : _a.value) === true ||
                name === 'constructor' ||
                typeof method !== 'function')
                return;
            if (this._p_props.endpoints[name])
                methodMap.set(name, method.bind(this));
            else if (!((_c = Object.getOwnPropertyNames((_b = this._p_props.hooks) !== null && _b !== void 0 ? _b : {}).find((hookName) => { var _a; return (_a = this._p_props.hooks) === null || _a === void 0 ? void 0 : _a[hookName].includes(name); })) !== null && _c !== void 0 ? _c : 0 > 0) &&
                !((_d = this._p_props.errorHandlers) === null || _d === void 0 ? void 0 : _d[name]))
                throw new Error(`Method "${name}" in service "${this.constructor.name}" is not decorated, use the @Transient decorator to ignore this method.`);
        });
        return methodMap;
    }
    _buildEndpointFunction(name) {
        var _a, _b;
        const endpoint = this._p_props.endpoints[name];
        const url = `${(_a = this._g_props) === null || _a === void 0 ? void 0 : _a.url}${(_b = this._p_props.suffix) !== null && _b !== void 0 ? _b : ''}${endpoint.url}`;
        this[name] = async () => {
            var _a, _b, _c, _d, _e;
            const axiosConfigInherit = Object.assign(Object.assign(Object.assign({}, (_a = this._g_props) === null || _a === void 0 ? void 0 : _a.options.axiosConfig), this._p_props.axiosConfig), endpoint.axiosConfig);
            const axiosConfig = Object.assign(Object.assign({ method: endpoint.method, url, timeout: (_c = (_b = endpoint.timeout) !== null && _b !== void 0 ? _b : this._p_props.timeout) !== null && _c !== void 0 ? _c : (_d = this._g_props) === null || _d === void 0 ? void 0 : _d.options.timeout }, axiosConfigInherit), { headers: Object.assign(Object.assign(Object.assign(Object.assign({ 'User-Agent': `kaqi/${package_json_1.version}` }, (_e = this._g_props) === null || _e === void 0 ? void 0 : _e.options.headers), this._p_props.headers), endpoint.headers), axiosConfigInherit.headers) });
            try {
                const result = await this._axios.request(axiosConfig);
                return result.data;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    if (!error.response)
                        throw error;
                    this._handleHttpError(error, name);
                    return Object.entries(error.response.data).length > 0
                        ? error.response.data
                        : undefined;
                }
            }
        };
    }
    _handleHttpError(error, endpoint) {
        var _a;
        let errorHandlerToUse;
        Object.entries((_a = this._p_props.errorHandlers) !== null && _a !== void 0 ? _a : {}).forEach((value) => {
            var _a;
            if (!errorHandlerToUse) {
                errorHandlerToUse = this[value[0]];
                return;
            }
            // check if the error handler is more specific than the current one, if yes replace errorHandlerToUse
            // undefined, undefined < [404, 401], undefined < 404, undefined < 401, ['endpoint1', 'endpoint2'] < 401, 'endpoint1'
            Object.entries((_a = this._p_props.errorHandlers) !== null && _a !== void 0 ? _a : {}).forEach(([key, value]) => {
                var _a, _b, _c;
                if (!errorHandlerToUse) {
                    errorHandlerToUse = this[key];
                    return;
                }
                const currentHandler = this[key];
                const currentHttpStatus = value.httpStatus;
                const currentEndpoints = value.endpoints;
                if (currentHandler &&
                    ((Array.isArray(currentHttpStatus) &&
                        currentHttpStatus.includes((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 0)) ||
                        currentHttpStatus === ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) ||
                        (Array.isArray(currentEndpoints) &&
                            currentEndpoints.includes(endpoint)) ||
                        currentEndpoints === endpoint)) {
                    errorHandlerToUse = currentHandler;
                }
            });
        });
        if (errorHandlerToUse)
            errorHandlerToUse(error, endpoint);
        else
            throw error;
    }
    _injectHooks(name) {
        var _a;
        if ((_a = this._p_props.hooks) === null || _a === void 0 ? void 0 : _a[name]) {
            this._p_props.hooks[name].forEach((hookName) => {
                const hook = this[hookName];
                if (hook instanceof Function) {
                    const currentMethod = this[name];
                    this[name] = async (...args) => {
                        const result = await currentMethod(...args);
                        return hook(result);
                    };
                }
            });
        }
    }
}
__decorate([
    __1.Transient,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Service.prototype, "_makeMethodMap", null);
__decorate([
    __1.Transient,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Service.prototype, "_buildEndpointFunction", null);
__decorate([
    __1.Transient,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [axios_1.AxiosError, String]),
    __metadata("design:returntype", void 0)
], Service.prototype, "_handleHttpError", null);
__decorate([
    __1.Transient,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Service.prototype, "_injectHooks", null);
exports.Service = Service;

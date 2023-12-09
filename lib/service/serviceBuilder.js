"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBuilder = void 0;
class ServiceBuilder {
    constructor(options) {
        this.options = options;
    }
    build(service) {
        return new service(this);
    }
    get url() {
        var _a, _b;
        return `${((_a = this.options.secure) !== null && _a !== void 0 ? _a : true) ? 'https' : 'http'}://${this.options.host}${(_b = this.options.basePath) !== null && _b !== void 0 ? _b : ''}`;
    }
}
exports.ServiceBuilder = ServiceBuilder;

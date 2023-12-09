import { ServiceBuilder } from '..';
export declare class Service {
    _pre_p_props: any;
    private _p_props;
    private _g_props;
    private _methodMap;
    private _axios;
    constructor(builder: ServiceBuilder);
    private _makeMethodMap;
    private _buildEndpointFunction;
    private _handleHttpError;
    private _injectHooks;
}

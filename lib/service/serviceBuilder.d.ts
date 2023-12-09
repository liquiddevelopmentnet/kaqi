import { AxiosRequestConfig } from 'axios';
import { Service } from '..';
interface ServiceBuilderOptions {
    host: string;
    secure?: boolean;
    basePath?: string;
    headers?: Record<string, string>;
    axiosConfig?: AxiosRequestConfig;
    timeout?: number;
}
export declare class ServiceBuilder {
    options: ServiceBuilderOptions;
    constructor(options: ServiceBuilderOptions);
    build<T extends Service>(service: new (builder: ServiceBuilder) => T): T;
    get url(): string;
}
export {};

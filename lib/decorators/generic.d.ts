import { AxiosRequestConfig } from 'axios';
import { Service } from '..';
export declare const Transient: (target: any, methodName: string) => any;
export declare const UrlSuffix: (suffix?: string) => (target: typeof Service) => void;
export declare const ErrorHandler: (httpStatus?: number | number[], endpoints?: string | string[]) => (target: Service, method: string) => void;
export declare const Hook: (endpointName: string) => (target: Service, hookName: string) => void;
export declare const Headers: {
    Service: (headers: Record<string, string>) => (target: typeof Service) => void;
    Method: (headers: Record<string, string>) => (target: Service, endpointName: string) => void;
};
export declare const AxiosConfig: {
    Service: (axiosConfig: AxiosRequestConfig) => (target: typeof Service) => void;
    Method: (axiosConfig: AxiosRequestConfig) => (target: Service, endpointName: string) => void;
};
export declare const Timeout: {
    Service: (timeout: number) => (target: typeof Service) => void;
    Method: (timeout: number) => (target: Service, endpointName: string) => void;
};

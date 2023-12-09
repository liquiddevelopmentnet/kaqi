import { Service } from '..';
export declare const ensureProps: (target: Service, field: string) => void;
export declare const buildServiceDecorator: (fields: Record<string, unknown>) => (target: typeof Service) => void;
export declare const buildMethodDecorator: (fields: Record<string, unknown>) => (target: Service, endpointName: string) => void;

import "reflect-metadata";
import { DataConnector, EndpointConfig } from "./DataConnector";
export declare class ReflectionService {
    defineMetadata(target: Object, propertyKey: string, metadata: Record<string, any>): void;
    getMetadata(target: Object, propertyKey: string): Record<string, any> | undefined;
    getAllProperties(target: Object): string[];
    getDataProperties(target: Object): Record<string, any>;
    getMethods(target: Object): Record<string, Function>;
    addEndpoint(dataConnector: DataConnector, endpointName: string, endpointConfig: EndpointConfig, metadata?: Record<string, any>): void;
    editEndpoint(dataConnector: DataConnector, endpointName: string, newConfig: Partial<EndpointConfig>, newMetadata?: Record<string, any>): void;
    getEndpoint(dataConnector: DataConnector, endpointName: string): EndpointConfig | undefined;
    getEndpointMetadata(dataConnector: DataConnector, endpointName: string): Record<string, any> | undefined;
    addConfigProperty(dataConnector: DataConnector, propertyName: string, value: any, metadata?: Record<string, any>): void;
    editConfigProperty(dataConnector: DataConnector, propertyName: string, newValue: any, newMetadata?: Record<string, any>): void;
    getConfigProperty(dataConnector: DataConnector, propertyName: string): any;
    getConfigPropertyMetadata(dataConnector: DataConnector, propertyName: string): Record<string, any> | undefined;
}

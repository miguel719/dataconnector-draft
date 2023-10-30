import "reflect-metadata";
import { DataConnector, EndpointConfig, Config } from "./DataConnector";

export class ReflectionService {
  // Basic Reflection Methods
  defineMetadata(
    target: Object,
    propertyKey: string,
    metadata: Record<string, any>
  ) {
    Reflect.defineMetadata(propertyKey, metadata, target);
  }

  getMetadata(
    target: Object,
    propertyKey: string
  ): Record<string, any> | undefined {
    return Reflect.getMetadata(propertyKey, target);
  }

  getAllProperties(target: Object): string[] {
    return Reflect.ownKeys(target).map((key) => key.toString());
  }

  getDataProperties(target: Object): Record<string, any> {
    const properties: Record<string, any> = {};
    for (const key of Reflect.ownKeys(target)) {
      const value = (target as any)[key];
      if (typeof value !== "function") {
        properties[key.toString()] = value;
      }
    }
    return properties;
  }

  getMethods(target: Object): Record<string, Function> {
    const methods: Record<string, Function> = {};
    let currentObj = target;
    while (currentObj !== Object.prototype) {
      for (const key of Reflect.ownKeys(currentObj)) {
        const value = (currentObj as any)[key];
        if (typeof value === "function") {
          methods[key.toString()] = value;
        }
      }
      currentObj = Object.getPrototypeOf(currentObj);
    }
    return methods;
  }

  // Endpoint Reflection Methods
  addEndpoint(
    dataConnector: DataConnector,
    endpointName: string,
    endpointConfig: EndpointConfig,
    metadata?: Record<string, any>
  ): void {
    dataConnector.endpoints[endpointName] = endpointConfig;
    if (metadata) {
      this.defineMetadata(dataConnector.endpoints, endpointName, metadata);
    }
  }

  editEndpoint(
    dataConnector: DataConnector,
    endpointName: string,
    newConfig: Partial<EndpointConfig>,
    newMetadata?: Record<string, any>
  ): void {
    if (!dataConnector.endpoints[endpointName]) {
      console.error(`Endpoint ${endpointName} does not exist`);
      return;
    }
    dataConnector.endpoints[endpointName] = {
      ...dataConnector.endpoints[endpointName],
      ...newConfig,
    };
    if (newMetadata) {
      const existingMetadata =
        this.getMetadata(dataConnector.endpoints, endpointName) || {};
      this.defineMetadata(dataConnector.endpoints, endpointName, {
        ...existingMetadata,
        ...newMetadata,
      });
    }
  }

  getEndpoint(
    dataConnector: DataConnector,
    endpointName: string
  ): EndpointConfig | undefined {
    return dataConnector.endpoints[endpointName];
  }

  getEndpointMetadata(
    dataConnector: DataConnector,
    endpointName: string
  ): Record<string, any> | undefined {
    return this.getMetadata(dataConnector.endpoints, endpointName);
  }

  // Config Reflection Methods
  addConfigProperty(
    dataConnector: DataConnector,
    propertyName: string,
    value: any,
    metadata?: Record<string, any>
  ): void {
    dataConnector.config[propertyName] = value;
    if (metadata) {
      this.defineMetadata(dataConnector.config, propertyName, metadata);
    }
  }

  editConfigProperty(
    dataConnector: DataConnector,
    propertyName: string,
    newValue: any,
    newMetadata?: Record<string, any>
  ): void {
    if (!dataConnector.config.hasOwnProperty(propertyName)) {
      console.error(`Config property ${propertyName} does not exist`);
      return;
    }
    dataConnector.config[propertyName] = newValue;
    if (newMetadata) {
      const existingMetadata =
        this.getMetadata(dataConnector.config, propertyName) || {};
      this.defineMetadata(dataConnector.config, propertyName, {
        ...existingMetadata,
        ...newMetadata,
      });
    }
  }

  getConfigProperty(dataConnector: DataConnector, propertyName: string): any {
    return dataConnector.config[propertyName];
  }

  getConfigPropertyMetadata(
    dataConnector: DataConnector,
    propertyName: string
  ): Record<string, any> | undefined {
    return this.getMetadata(dataConnector.config, propertyName);
  }
}

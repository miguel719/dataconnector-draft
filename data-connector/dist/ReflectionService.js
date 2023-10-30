import "reflect-metadata";
export class ReflectionService {
    // Basic Reflection Methods
    defineMetadata(target, propertyKey, metadata) {
        Reflect.defineMetadata(propertyKey, metadata, target);
    }
    getMetadata(target, propertyKey) {
        return Reflect.getMetadata(propertyKey, target);
    }
    getAllProperties(target) {
        return Reflect.ownKeys(target).map((key) => key.toString());
    }
    getDataProperties(target) {
        const properties = {};
        for (const key of Reflect.ownKeys(target)) {
            const value = target[key];
            if (typeof value !== "function") {
                properties[key.toString()] = value;
            }
        }
        return properties;
    }
    getMethods(target) {
        const methods = {};
        let currentObj = target;
        while (currentObj !== Object.prototype) {
            for (const key of Reflect.ownKeys(currentObj)) {
                const value = currentObj[key];
                if (typeof value === "function") {
                    methods[key.toString()] = value;
                }
            }
            currentObj = Object.getPrototypeOf(currentObj);
        }
        return methods;
    }
    // Endpoint Reflection Methods
    addEndpoint(dataConnector, endpointName, endpointConfig, metadata) {
        dataConnector.endpoints[endpointName] = endpointConfig;
        if (metadata) {
            this.defineMetadata(dataConnector.endpoints, endpointName, metadata);
        }
    }
    editEndpoint(dataConnector, endpointName, newConfig, newMetadata) {
        if (!dataConnector.endpoints[endpointName]) {
            console.error(`Endpoint ${endpointName} does not exist`);
            return;
        }
        dataConnector.endpoints[endpointName] = Object.assign(Object.assign({}, dataConnector.endpoints[endpointName]), newConfig);
        if (newMetadata) {
            const existingMetadata = this.getMetadata(dataConnector.endpoints, endpointName) || {};
            this.defineMetadata(dataConnector.endpoints, endpointName, Object.assign(Object.assign({}, existingMetadata), newMetadata));
        }
    }
    getEndpoint(dataConnector, endpointName) {
        return dataConnector.endpoints[endpointName];
    }
    getEndpointMetadata(dataConnector, endpointName) {
        return this.getMetadata(dataConnector.endpoints, endpointName);
    }
    // Config Reflection Methods
    addConfigProperty(dataConnector, propertyName, value, metadata) {
        dataConnector.config[propertyName] = value;
        if (metadata) {
            this.defineMetadata(dataConnector.config, propertyName, metadata);
        }
    }
    editConfigProperty(dataConnector, propertyName, newValue, newMetadata) {
        if (!dataConnector.config.hasOwnProperty(propertyName)) {
            console.error(`Config property ${propertyName} does not exist`);
            return;
        }
        dataConnector.config[propertyName] = newValue;
        if (newMetadata) {
            const existingMetadata = this.getMetadata(dataConnector.config, propertyName) || {};
            this.defineMetadata(dataConnector.config, propertyName, Object.assign(Object.assign({}, existingMetadata), newMetadata));
        }
    }
    getConfigProperty(dataConnector, propertyName) {
        return dataConnector.config[propertyName];
    }
    getConfigPropertyMetadata(dataConnector, propertyName) {
        return this.getMetadata(dataConnector.config, propertyName);
    }
}

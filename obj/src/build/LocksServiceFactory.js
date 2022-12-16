"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const LocksMemoryPersistence_1 = require("../persistence/LocksMemoryPersistence");
const LocksFilePersistence_1 = require("../persistence/LocksFilePersistence");
const LocksMongoDbPersistence_1 = require("../persistence/LocksMongoDbPersistence");
const LocksController_1 = require("../logic/LocksController");
const LocksCommandableHttpServiceV1_1 = require("../services/version1/LocksCommandableHttpServiceV1");
class LocksServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(LocksServiceFactory.MemoryPersistenceDescriptor, LocksMemoryPersistence_1.LocksMemoryPersistence);
        this.registerAsType(LocksServiceFactory.FilePersistenceDescriptor, LocksFilePersistence_1.LocksFilePersistence);
        this.registerAsType(LocksServiceFactory.MongoDbPersistenceDescriptor, LocksMongoDbPersistence_1.LocksMongoDbPersistence);
        this.registerAsType(LocksServiceFactory.ControllerDescriptor, LocksController_1.LocksController);
        this.registerAsType(LocksServiceFactory.HttpServiceV1Descriptor, LocksCommandableHttpServiceV1_1.LocksCommandableHttpServiceV1);
    }
}
exports.LocksServiceFactory = LocksServiceFactory;
LocksServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-locks', 'persistence', 'memory', '*', '1.0');
LocksServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-locks', 'persistence', 'file', '*', '1.0');
LocksServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-locks', 'persistence', 'mongodb', '*', '1.0');
LocksServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-locks', 'controller', 'default', '*', '1.0');
LocksServiceFactory.HttpServiceV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-locks', 'service', 'commandable-http', '*', '1.0');
//# sourceMappingURL=LocksServiceFactory.js.map
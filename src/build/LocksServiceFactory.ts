import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { LocksMemoryPersistence } from '../persistence/LocksMemoryPersistence';
import { LocksFilePersistence } from '../persistence/LocksFilePersistence';
import { LocksMongoDbPersistence } from '../persistence/LocksMongoDbPersistence';
import { LocksController } from '../logic/LocksController';
import { LocksCommandableHttpServiceV1 } from '../services/version1/LocksCommandableHttpServiceV1';

export class LocksServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('service-locks', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('service-locks', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('service-locks', 'persistence', 'mongodb', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('service-locks', 'controller', 'default', '*', '1.0');
    public static HttpServiceV1Descriptor = new Descriptor('service-locks', 'service', 'commandable-http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(LocksServiceFactory.MemoryPersistenceDescriptor, LocksMemoryPersistence);
        this.registerAsType(LocksServiceFactory.FilePersistenceDescriptor, LocksFilePersistence);
        this.registerAsType(LocksServiceFactory.MongoDbPersistenceDescriptor, LocksMongoDbPersistence);
        this.registerAsType(LocksServiceFactory.ControllerDescriptor, LocksController);
        this.registerAsType(LocksServiceFactory.HttpServiceV1Descriptor, LocksCommandableHttpServiceV1);
    }
}
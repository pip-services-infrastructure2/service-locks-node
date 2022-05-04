import { ProcessContainer } from 'pip-services3-container-nodex';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import { LocksServiceFactory } from '../build/LocksServiceFactory';

export class LocksProcess extends ProcessContainer{
    public constructor(){
        super('jobs', 'Locks orchestration microservice');

        this._factories.add(new LocksServiceFactory());
        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new DefaultSwaggerFactory());
    }
}
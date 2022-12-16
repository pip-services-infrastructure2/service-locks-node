import { CommandableHttpService } from 'pip-services3-rpc-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

export class LocksCommandableHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/locks');
        this._dependencyResolver.put('controller', new Descriptor('service-locks', 'controller', '*', '*', '1.0'));
    }
}
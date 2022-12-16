"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksCommandableHttpServiceV1 = void 0;
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class LocksCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/locks');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-locks', 'controller', '*', '*', '1.0'));
    }
}
exports.LocksCommandableHttpServiceV1 = LocksCommandableHttpServiceV1;
//# sourceMappingURL=LocksCommandableHttpServiceV1.js.map
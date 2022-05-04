"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksHttpServiceV1 = void 0;
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class LocksHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/locks');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-locks', 'controller', '*', '*', '1.0'));
    }
}
exports.LocksHttpServiceV1 = LocksHttpServiceV1;
//# sourceMappingURL=LocksHttpServiceV1.js.map
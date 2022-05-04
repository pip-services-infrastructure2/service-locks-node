"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const LocksServiceFactory_1 = require("../build/LocksServiceFactory");
class LocksProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super('jobs', 'Locks orchestration microservice');
        this._factories.add(new LocksServiceFactory_1.LocksServiceFactory());
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory());
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory());
    }
}
exports.LocksProcess = LocksProcess;
//# sourceMappingURL=LocksProcess.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class LockV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('key', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('client_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('created', pip_services3_commons_nodex_2.TypeCode.DateTime);
        this.withRequiredProperty('expire_time', pip_services3_commons_nodex_2.TypeCode.DateTime);
    }
}
exports.LockV1Schema = LockV1Schema;
//# sourceMappingURL=LockV1Schema.js.map
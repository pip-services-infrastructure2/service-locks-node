"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocksCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
class LocksCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(controller) {
        super();
        this._default_ttl = 10 * 1000;
        this._default_timeout = 60 * 1000;
        this._controller = controller;
        this.addCommand(this.makeGetLocks());
        this.addCommand(this.makeGetLockById());
        this.addCommand(this.makeTryAcquireLock());
        this.addCommand(this.makeAcquireLock());
        this.addCommand(this.makeReleaseLock());
    }
    makeGetLocks() {
        return new pip_services3_commons_nodex_4.Command('get_locks', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_6.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_7.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_2.FilterParams.fromValue(args.get('filter'));
            let paging = pip_services3_commons_nodex_3.PagingParams.fromValue(args.get('paging'));
            return yield this._controller.getLocks(correlationId, filter, paging);
        }));
    }
    makeGetLockById() {
        return new pip_services3_commons_nodex_4.Command('get_lock_by_id', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('key', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let lockId = args.getAsString('key');
            return yield this._controller.getLockById(correlationId, lockId);
        }));
    }
    makeTryAcquireLock() {
        return new pip_services3_commons_nodex_4.Command('try_acquire_lock', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('key', pip_services3_commons_nodex_8.TypeCode.String)
            .withRequiredProperty('ttl', pip_services3_commons_nodex_8.TypeCode.Integer)
            .withRequiredProperty('client_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let key = args.getAsString('key');
            let ttl = args.getAsIntegerWithDefault('ttl', this._default_ttl);
            let client_id = args.getAsString('client_id');
            return yield this._controller.tryAcquireLock(correlationId, key, ttl, client_id);
        }));
    }
    makeAcquireLock() {
        return new pip_services3_commons_nodex_4.Command('acquire_lock', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('key', pip_services3_commons_nodex_8.TypeCode.String)
            .withRequiredProperty('ttl', pip_services3_commons_nodex_8.TypeCode.Integer)
            .withRequiredProperty('timeout', pip_services3_commons_nodex_8.TypeCode.Integer)
            .withRequiredProperty('client_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let key = args.getAsString('key');
            let ttl = args.getAsIntegerWithDefault('ttl', this._default_ttl);
            let timeout = args.getAsIntegerWithDefault('timeout', this._default_timeout);
            let client_id = args.getAsString('client_id');
            return yield this._controller.acquireLock(correlationId, key, ttl, timeout, client_id);
        }));
    }
    makeReleaseLock() {
        return new pip_services3_commons_nodex_4.Command('release_lock', new pip_services3_commons_nodex_5.ObjectSchema(false)
            .withRequiredProperty('key', pip_services3_commons_nodex_8.TypeCode.String)
            .withRequiredProperty('client_id', pip_services3_commons_nodex_8.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let key = args.getAsString('key');
            let client_id = args.getAsString('client_id');
            return yield this._controller.releaseLock(correlationId, key, client_id);
        }));
    }
}
exports.LocksCommandSet = LocksCommandSet;
//# sourceMappingURL=LocksCommandSet.js.map
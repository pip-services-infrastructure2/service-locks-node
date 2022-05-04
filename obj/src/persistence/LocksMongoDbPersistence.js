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
exports.LocksMongoDbPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class LocksMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('locks');
        this._retryTimeout = 100;
        this._maxPageSize = 1000;
        this.ensureIndex({
            client_id: 1
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let criteria = [];
        let key = filter.getAsNullableString('key');
        if (key != null) {
            let regex = new RegExp(key, "i");
            criteria.push({ _id: { $regex: regex } });
        }
        var fromCreated = filter.getAsNullableDateTime('from_created');
        if (fromCreated != null) {
            criteria.push({
                created: { $gte: fromCreated }
            });
        }
        var toCreated = filter.getAsNullableDateTime('to_created');
        if (toCreated != null) {
            criteria.push({
                created: { $lt: toCreated }
            });
        }
        var fromExpired = filter.getAsNullableDateTime('from_expired');
        if (fromExpired != null) {
            criteria.push({
                expire_time: { $gte: fromExpired }
            });
        }
        var toExpired = filter.getAsNullableDateTime('to_expired');
        if (toExpired != null) {
            criteria.push({
                expire_time: { $lt: toExpired }
            });
        }
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    tryAcquireLock(correlationId, key, ttl, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = Date.now();
            let criteria = {
                _id: key
            };
            let update = {
                $setOnInsert: {
                    id: key,
                    created: new Date(now),
                    expire_time: new Date(now + ttl),
                    client_id: client_id
                }
            };
            let options = {
                upsert: true
            };
            let result = yield this._collection.findOneAndUpdate(criteria, update, options);
            let item = result ? this.convertToPublic(result.value) : null;
            return item == null;
        });
    }
    releaseLock(correlationId, key, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {
                _id: key
            };
            if (client_id) {
                filter['client_id'] = client_id;
            }
            let result = yield this._collection.findOneAndDelete(filter);
            let oldItem = result ? this.convertToPublic(result.value) : null;
            if (!oldItem) {
                throw new pip_services3_commons_nodex_1.NotFoundException(correlationId, 'LOCK_NOT_FOUND', 'Lock with key ' + key + ' not found!');
            }
        });
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, null, null);
        });
    }
    deleteByFilter(correlationId, filter) {
        const _super = Object.create(null, {
            deleteByFilter: { get: () => super.deleteByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.deleteByFilter.call(this, correlationId, this.composeFilter(filter));
        });
    }
}
exports.LocksMongoDbPersistence = LocksMongoDbPersistence;
//# sourceMappingURL=LocksMongoDbPersistence.js.map
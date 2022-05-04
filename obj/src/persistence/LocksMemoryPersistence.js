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
exports.LocksMemoryPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
class LocksMemoryPersistence extends pip_services3_data_nodex_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let key = filter.getAsNullableString('key');
        var fromCreated = filter.getAsNullableDateTime('from_created');
        var toCreated = filter.getAsNullableDateTime('to_created');
        var fromExpired = filter.getAsNullableDateTime('from_expired');
        var toExpired = filter.getAsNullableDateTime('to_expired');
        return (item) => {
            if (key != null && !this.matchString(item.id, key))
                return false;
            if (fromCreated != null && item.created.getTime() < fromCreated.getTime())
                return false;
            if (toCreated != null && item.created.getTime() > toCreated.getTime())
                return false;
            if (fromExpired != null && item.expire_time.getTime() < fromExpired.getTime())
                return false;
            if (toExpired != null && item.expire_time.getTime() > toExpired.getTime())
                return false;
            return true;
        };
    }
    tryAcquireLock(correlationId, key, ttl, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = this._items.find((item) => item.id == key);
            let now = new Date().getTime();
            if (item == null) {
                item = {
                    id: key,
                    created: new Date(now),
                    expire_time: new Date(0),
                    client_id: client_id
                };
                this._items.push(item);
            }
            let result = false;
            if (item.expire_time.getTime() < now) {
                item.expire_time = new Date(now + ttl);
                result = true;
            }
            yield this.save(correlationId);
            return result;
        });
    }
    releaseLock(correlationId, key, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var index = this._items.map(x => x.id).indexOf(key);
            var item = index < 0 ? null : this._items[index];
            if (item == null || (client_id != null && item.client_id != client_id)) {
                throw new pip_services3_commons_nodex_1.NotFoundException(correlationId, 'LOCK_NOT_FOUND', 'Lock with key ' + key + ' not found!');
            }
            this._items.splice(index, 1);
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
            return yield _super.deleteByFilter.call(this, correlationId, this.composeFilter(filter));
        });
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
}
exports.LocksMemoryPersistence = LocksMemoryPersistence;
//# sourceMappingURL=LocksMemoryPersistence.js.map
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
exports.LocksController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const LocksCommandSet_1 = require("./LocksCommandSet");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
class LocksController {
    constructor() {
        this._opened = false;
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._timer = new pip_services3_commons_nodex_3.FixedRateTimer(() => null);
        this._cleanInterval = 1000 * 60 * 5;
        this._retryTimeout = 100;
        this._releaseOwnLocksOnly = true;
    }
    configure(config) {
        this._config = config;
        this._logger.configure(config);
        this._cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this._releaseOwnLocksOnly = config.getAsBooleanWithDefault('options.release_own_locks_only', true);
        this._release_admin_id = config.getAsStringWithDefault('options.release_admin_id', pip_services3_commons_nodex_1.IdGenerator.nextLong());
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.setCallback(() => {
                this.cleanLocks(correlationId);
            });
            if (this._cleanInterval > 0) {
                this._timer.setInterval(this._cleanInterval);
                this._timer.start();
            }
            this._opened = true;
            this._logger.trace(correlationId, "Locks controller is opened");
        });
    }
    isOpen() {
        return this._opened;
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._timer.isStarted) {
                this._timer.stop();
            }
            this._opened = false;
            this._logger.trace(correlationId, "Locks controller is closed");
        });
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_nodex_2.Descriptor('service-locks', 'persistence', '*', '*', '1.0'));
        this._logger.setReferences(references);
    }
    getCommandSet() {
        if (this._commandSet == null) {
            this._commandSet = new LocksCommandSet_1.LocksCommandSet(this);
        }
        return this._commandSet;
    }
    getLocks(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    getLockById(correlationId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getOneById(correlationId, key);
        });
    }
    tryAcquireLock(correlationId, key, ttl, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.tryAcquireLock(correlationId, key, ttl, client_id);
        });
    }
    acquireLock(correlationId, key, ttl, timeout, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let retryTime = new Date().getTime() + timeout;
            // Try to get lock first
            let result = yield this.tryAcquireLock(correlationId, key, ttl, client_id);
            if (result)
                return;
            // Start retrying
            while (true) {
                // When timeout expires return false
                let now = new Date().getTime();
                if (now > retryTime) {
                    throw new pip_services3_commons_nodex_1.ConflictException(correlationId, "LOCK_TIMEOUT", "Acquiring lock " + key + " failed on timeout").withDetails("key", key);
                }
                result = yield this._persistence.tryAcquireLock(correlationId, key, ttl, client_id);
                if (result) {
                    break;
                }
                yield new Promise(r => setTimeout(r, this._retryTimeout));
            }
        });
    }
    releaseLock(correlationId, key, client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let clientId = client_id || '';
            if (!this._releaseOwnLocksOnly || client_id == this._release_admin_id) {
                clientId = null;
            }
            yield this._persistence.releaseLock(correlationId, key, clientId);
        });
    }
    // Clean expired locks
    cleanLocks(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            this._logger.trace(correlationId, "Starting locks cleaning...");
            try {
                yield this._persistence.deleteByFilter(correlationId, pip_services3_commons_nodex_1.FilterParams.fromTuples('to_expired', now));
            }
            catch (err) {
                this._logger.error(correlationId, err, "Failed to clean up locks.");
            }
            this._logger.trace(correlationId, "Locks cleaning ended.");
        });
    }
}
exports.LocksController = LocksController;
//# sourceMappingURL=LocksController.js.map
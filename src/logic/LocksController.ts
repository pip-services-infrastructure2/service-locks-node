import { FilterParams, IOpenable, AnyValueMap, ConflictException, IdGenerator } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';

import { LockV1 } from '../data/version1/LockV1';
import { ILocksPersistence } from '../persistence/ILocksPersistence';
import { ILocksController } from './ILocksController';
import { LocksCommandSet } from './LocksCommandSet';
import { FixedRateTimer } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';

export class LocksController implements ILocksController, IConfigurable, IReferenceable, ICommandable, IOpenable {
    private _persistence: ILocksPersistence;
    private _commandSet: LocksCommandSet;
    private _opened: boolean = false;
    private _config: ConfigParams;
    private _logger: CompositeLogger = new CompositeLogger();

    private _timer: FixedRateTimer = new FixedRateTimer(() => null);
    private _cleanInterval: number = 1000 * 60 * 5;

    private _retryTimeout: number = 100;
    private _releaseOwnLocksOnly: boolean = true;
    private _release_admin_id: string;

    public constructor() {
    }

    public configure(config: ConfigParams): void {
        this._config = config;
        this._logger.configure(config);

        this._cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this._releaseOwnLocksOnly = config.getAsBooleanWithDefault('options.release_own_locks_only', true);
        this._release_admin_id = config.getAsStringWithDefault('options.release_admin_id', IdGenerator.nextLong());
    }

    public async open(correlationId: string): Promise<void> {
        this._timer.setCallback(() => {
            this.cleanLocks(correlationId);
        });
        if (this._cleanInterval > 0) {
            this._timer.setInterval(this._cleanInterval);
            this._timer.start();
        }

        this._opened = true;
        this._logger.trace(correlationId, "Locks controller is opened");
    }

    public isOpen(): boolean {
        return this._opened;
    }

    public async close(correlationId: string): Promise<void> {
        if (this._timer.isStarted) {
            this._timer.stop();
        }

        this._opened = false;
        this._logger.trace(correlationId, "Locks controller is closed");
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<ILocksPersistence>(
            new Descriptor('service-locks', 'persistence', '*', '*', '1.0')
        );
        this._logger.setReferences(references);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new LocksCommandSet(this);
        }
        return this._commandSet;
    }

    public async getLocks(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LockV1>> {
        return await this._persistence.getPageByFilter(correlationId, filter, paging);
    }

    public async getLockById(correlationId: string, key: string): Promise<LockV1> {
        return await this._persistence.getOneById(correlationId, key);
    }

    public async tryAcquireLock(correlationId: string, key: string, ttl: number, client_id: string): Promise<boolean> {
        return await this._persistence.tryAcquireLock(correlationId, key, ttl, client_id);
    }

    public async acquireLock(correlationId: string, key: string, ttl: number, timeout: number, client_id: string): Promise<void> {
        let retryTime = new Date().getTime() + timeout;

        // Try to get lock first
        let result = await this.tryAcquireLock(correlationId, key, ttl, client_id);
        if (result) return;

        // Start retrying
        while(true) {
            // When timeout expires return false
            let now = new Date().getTime();
            if (now > retryTime) {
                throw new ConflictException(
                    correlationId,
                    "LOCK_TIMEOUT",
                    "Acquiring lock " + key + " failed on timeout"
                ).withDetails("key", key);
            }

            result = await this._persistence.tryAcquireLock(correlationId, key, ttl, client_id);
            if (result) {
                break;
            }

            await new Promise(r => setTimeout(r, this._retryTimeout));
        }
    }

    public async releaseLock(correlationId: string, key: string, client_id: string): Promise<void> {
        let clientId: string = client_id || '';

        if (!this._releaseOwnLocksOnly || client_id == this._release_admin_id) {
            clientId = null;
        }

        await this._persistence.releaseLock(correlationId, key, clientId);
    }

    // Clean expired locks
    public async cleanLocks(correlationId: string): Promise<void> {
        let now = new Date();

        this._logger.trace(correlationId, "Starting locks cleaning...");

        try {
            await this._persistence.deleteByFilter(
                correlationId,
                FilterParams.fromTuples(
                    'to_expired', now
                )
            );
        } catch(err) {
            this._logger.error(correlationId, err, "Failed to clean up locks.");
        }
        
        this._logger.trace(correlationId, "Locks cleaning ended.");
    }

}

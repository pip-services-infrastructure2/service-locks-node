import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';
import { LockV1 } from '../data/version1/LockV1';
import { ILocksPersistence } from './ILocksPersistence';
export declare class LocksMongoDbPersistence extends IdentifiableMongoDbPersistence<LockV1, string> implements ILocksPersistence {
    private _retryTimeout;
    constructor();
    private composeFilter;
    tryAcquireLock(correlationId: string, key: string, ttl: number, client_id: string): Promise<boolean>;
    releaseLock(correlationId: string, key: string, client_id: string): Promise<void>;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LockV1>>;
    deleteByFilter(correlationId: string, filter: FilterParams): Promise<void>;
}

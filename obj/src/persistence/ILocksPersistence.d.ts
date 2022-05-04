import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { LockV1 } from '../data/version1/LockV1';
export interface ILocksPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LockV1>>;
    getOneById(correlationId: string, key: string): Promise<LockV1>;
    tryAcquireLock(correlationId: string, key: string, ttl: number, client_id: string): Promise<boolean>;
    releaseLock(correlationId: string, key: string, client_id: string): Promise<void>;
    deleteByFilter(correlationId: string, filter: FilterParams): Promise<void>;
}

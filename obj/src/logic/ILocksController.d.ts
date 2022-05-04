import { FilterParams } from "pip-services3-commons-nodex";
import { PagingParams } from "pip-services3-commons-nodex";
import { DataPage } from "pip-services3-commons-nodex";
import { LockV1 } from "../data/version1";
export interface ILocksController {
    getLocks(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LockV1>>;
    getLockById(correlationId: string, key: string): Promise<LockV1>;
    tryAcquireLock(correlationId: string, key: string, ttl: number, client_id: string): Promise<boolean>;
    acquireLock(correlationId: string, key: string, ttl: number, timeout: number, client_id: string): Promise<void>;
    releaseLock(correlationId: string, key: string, client_id: string): Promise<void>;
}

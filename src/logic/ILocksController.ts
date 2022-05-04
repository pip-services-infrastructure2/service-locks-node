import { FilterParams } from "pip-services3-commons-nodex";
import { PagingParams } from "pip-services3-commons-nodex";
import { DataPage } from "pip-services3-commons-nodex";

import { LockV1 } from "../data/version1";

export interface ILocksController {
    // Get list of all locks
    getLocks(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<LockV1>>;
    
    // Get lock by key
    getLockById(correlationId: string, key: string): Promise<LockV1>;
    
    // Makes a single attempt to acquire a lock by its key
    tryAcquireLock(correlationId: string, key: string, ttl: number, client_id: string): Promise<boolean>;
    
    // Makes multiple attempts to acquire a lock by its key within give time interval
    acquireLock(correlationId: string, key: string, ttl: number, timeout: number, client_id: string): Promise<void>;
    
        // Releases prevously acquired lock by its key
    releaseLock(correlationId: string, key: string, client_id: string): Promise<void>;
}
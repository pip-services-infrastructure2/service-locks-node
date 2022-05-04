const assert = require('chai').assert;

import { FilterParams, IdGenerator } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { ILocksPersistence } from '../../src/persistence/ILocksPersistence';

let now = new Date();

let LOCK1: string = "lock_1";
let LOCK2: string = "lock_2";
let LOCK3: string = "lock_3";

export class LocksPersistenceFixture {
    private _persistence: ILocksPersistence;
    private _client_id: string;
    private _admin_id: string;

    public constructor(persistence: ILocksPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;

        this._client_id = IdGenerator.nextLong();
        this._admin_id = IdGenerator.nextLong();
    }

    public async testTryAcquireLock(): Promise<void> {
        // Try to acquire lock for the first time
        let result = await this._persistence.tryAcquireLock(null, LOCK1, 3000, this._client_id);

        assert.isTrue(result);

        // Try to acquire lock for the second time
        result = await this._persistence.tryAcquireLock(null, LOCK1, 3000, this._client_id);

        assert.isFalse(result);

        // Release the lock
        await this._persistence.releaseLock(null, LOCK1, this._client_id);

        // Try to acquire lock for the third time
        result = await this._persistence.tryAcquireLock(null, LOCK1, 3000, this._client_id);

        assert.isTrue(result);

        // Release the lock
        await this._persistence.releaseLock(null, LOCK1, this._client_id);
    }

    public async testGetWithFilters(): Promise<void> {
        let now = Date.now();

        // Try to acquire first lock
        let result = await this._persistence.tryAcquireLock(null, LOCK1, 3000, this._client_id); 

        assert.isTrue(result);

        // Try to acquire second lock
        result = await this._persistence.tryAcquireLock(null, LOCK2, 20000, this._client_id);

        assert.isTrue(result);

        //  Get all locks
        let page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'key', 'lock_'
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 2);

        //  Get locks by expired
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromTuples(
                'from_expired', new Date(now + 5000),
                'to_expired', new Date(now + 21000),
            ),
            new PagingParams()
        );

        assert.lengthOf(page.data, 1);

        // Release the first lock
        await this._persistence.releaseLock(null, LOCK1, this._client_id);

        // Release the second lock
        await this._persistence.releaseLock(null, LOCK2, this._client_id);
    }
}

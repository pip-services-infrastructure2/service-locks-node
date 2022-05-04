const assert = require('chai').assert;

import { ConfigParams, IdGenerator } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { LocksMemoryPersistence } from '../../src/persistence/LocksMemoryPersistence';
import { LocksController } from '../../src/logic/LocksController';

let LOCK1: string = "lock_1";
let LOCK2: string = "lock_2";
let LOCK3: string = "lock_3";

suite('LocksController', () => {
    let persistence: LocksMemoryPersistence;
    let controller: LocksController;
    let client_id: string;
    let admin_id: string;

    setup(async () => {
        client_id = IdGenerator.nextLong();
        admin_id = IdGenerator.nextLong();

        persistence = new LocksMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new LocksController();
        controller.configure(ConfigParams.fromTuples(
            'options.release_own_locks_only', true,
            'options.release_admin_id', admin_id
        ));

        let references = References.fromTuples(
            new Descriptor('service-locks', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-locks', 'controller', 'default', 'default', '1.0'), controller
        );

        controller.setReferences(references);

        await persistence.open(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('TryAcquireLock', async () => {
        // Try to acquire lock for the first time
        let result = await controller.tryAcquireLock(null, LOCK1, 3000, client_id);

        assert.isTrue(result);

        // Try to acquire lock for the second time
        result = await controller.tryAcquireLock(null, LOCK1, 3000, client_id);

        assert.isFalse(result);

        // Release the lock
        await controller.releaseLock(null, LOCK1, client_id);

        // Try to acquire lock for the third time
        result = await controller.tryAcquireLock(null, LOCK1, 3000, client_id);

        assert.isTrue(result);

        // Release the lock
        await controller.releaseLock(null, LOCK1, client_id);

        // Try to acquire lock for the fourth time
        result = await controller.tryAcquireLock(null, LOCK1, 4000, client_id);

        assert.isTrue(result);

        // Try to release the lock with wrong client id
        let err: Error;
        try {
            await controller.releaseLock(null, LOCK1, IdGenerator.nextLong());
        } catch(e) {
            err = e;
        }

        assert.isNotNull(err || null); // should get an error

        // Try to acquire lock to check it still exist
        result = await controller.tryAcquireLock(null, LOCK1, 4000, client_id);

        assert.isFalse(result);

        // Release the lock with admin id
        await controller.releaseLock(null, LOCK1, admin_id);

         // Try to acquire lock to check it not exist
        result = await controller.tryAcquireLock(null, LOCK1, 4000, client_id);

        assert.isTrue(result);

        // Release the lock
        await controller.releaseLock(null, LOCK1, client_id);
    });


    test('AcquireLock', async () => {
        // Acquire lock for the first time
        await controller.acquireLock(null, LOCK2, 3000, 1000, client_id);

        // Acquire lock for the second time
        let err: Error;
        try {
            await controller.acquireLock(null, LOCK2, 3000, 1000, client_id);
        } catch(e) {
            err = e;
        }

        assert.isNotNull(err || null);

        // Release the lock
        await controller.releaseLock(null, LOCK2, client_id);

        // Acquire lock for the third time
        await controller.acquireLock(null, LOCK2, 3000, 1000, client_id);

        // Release the lock
        await controller.releaseLock(null, LOCK2, client_id);
    });

});
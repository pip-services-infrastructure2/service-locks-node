import { ConfigParams } from 'pip-services3-commons-nodex';

import { LocksMemoryPersistence } from '../../src/persistence/LocksMemoryPersistence';
import { LocksPersistenceFixture } from './LocksPersistenceFixture';

suite('LocksMemoryPersistence', () => {
    let persistence: LocksMemoryPersistence;
    let fixture: LocksPersistenceFixture;

    setup(async () => {
        persistence = new LocksMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new LocksPersistenceFixture(persistence);

        await persistence.open(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('TryAcquireLock', async () => {
        await fixture.testTryAcquireLock();
    });

    test('GetWithFilters', async () => {
        await fixture.testGetWithFilters();
    });
});
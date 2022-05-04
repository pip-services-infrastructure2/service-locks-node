import { ConfigParams } from 'pip-services3-commons-nodex';

import { LocksFilePersistence } from '../../src/persistence/LocksFilePersistence';
import { LocksPersistenceFixture } from './LocksPersistenceFixture';

suite('LocksFilePersistence', () => {
    let persistence: LocksFilePersistence;
    let fixture: LocksPersistenceFixture;

    setup(async () => {
        persistence = new LocksFilePersistence('data/locks.test.json');
        persistence.configure(new ConfigParams());

        fixture = new LocksPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
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
import { ConfigParams } from 'pip-services3-commons-nodex';

import { LocksMongoDbPersistence } from '../../src/persistence/LocksMongoDbPersistence';
import { LocksPersistenceFixture } from './LocksPersistenceFixture';

suite('LocksMongoDbPersistence', () => {
    let persistence: LocksMongoDbPersistence;
    let fixture: LocksPersistenceFixture;

    let mongoUri = process.env['MONGO_SERVICE_URI'];
    let mongoHost = process.env['MONGO_SERVICE_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_SERVICE_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_SERVICE_DB'] || 'test';

    // Exit if mongo connection is not set
    if (mongoUri == '' && mongoHost == '')
        return;

    setup(async () => {
        persistence = new LocksMongoDbPersistence();
        persistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDatabase
        ));

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

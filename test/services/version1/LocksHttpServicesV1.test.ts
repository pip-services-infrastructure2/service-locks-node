const assert = require('chai').assert;
const restify = require('restify');

import { ConfigParams, DateTimeConverter, IdGenerator } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { LocksMemoryPersistence } from '../../../src/persistence/LocksMemoryPersistence';
import { LocksController } from '../../../src/logic/LocksController';
import { LocksHttpServiceV1 } from '../../../src/services/version1/LocksHttpServiceV1';


let LOCK1: string = "lock_1";
let LOCK2: string = "lock_2";
let LOCK3: string = "lock_3";

suite('LocksHttpServiceV1', () => {
    let persistence: LocksMemoryPersistence;
    let controller: LocksController;
    let service: LocksHttpServiceV1;
    let rest: any;
    let client_id: string;
    let admin_id: string;

    setup(async () => {
        client_id = IdGenerator.nextLong();
        admin_id = IdGenerator.nextLong();

        let url = "http://localhost:3000";
        rest = restify.createJsonClient({ url: url, version: '*' });

        persistence = new LocksMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new LocksController();
        controller.configure(ConfigParams.fromTuples(
            'options.release_own_locks_only', true,
            'options.release_admin_id', admin_id
        ));

        service = new LocksHttpServiceV1();
        service.configure(ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        ));

        let references = References.fromTuples(
            new Descriptor('service-locks', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-locks', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-locks', 'service', 'http', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        await persistence.open(null);
        await service.open(null);
    });

    teardown(async () => {
        await service.close(null);
        await persistence.close(null);
    });

    test('TryAcquireLock', async () => {
        // Try to acquire lock for the first time
        let result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/try_acquire_lock',
                {
                    key: LOCK1,
                    ttl: 3000,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.equal(result, true);

        // Try to acquire lock for the second time
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/try_acquire_lock',
                {
                    key: LOCK1,
                    ttl: 3000,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(Object.keys(result).length == 0 ? false : result );
                    else reject(err);
                }
            );
        });

        assert.equal(result, false);

        // Release the lock
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/release_lock',
                {
                    key: LOCK1,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Try to acquire lock for the third time
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/try_acquire_lock',
                {
                    key: LOCK1,
                    ttl: 3000,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.equal(result, true);

        // Release the lock
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/release_lock',
                {
                    key: LOCK1,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });
    });

    test('AcquireLock', async () => {
        // Acquire lock for the first time
        let result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/acquire_lock',
                {
                    key: LOCK2,
                    ttl: 3000,
                    timeout: 1000,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Acquire lock for the second time
        let err: Error;
        try {
            await new Promise<any>((resolve, reject) => {
                rest.post('/v1/locks/acquire_lock',
                    {
                        key: LOCK2,
                        ttl: 3000,
                        timeout: 1000,
                        client_id: client_id
                    },
                    (err, req, res, result) => {
                        if (err == null) resolve(result);
                        else reject(err);
                    }
                );
            });
        } catch(e) {
            err = e;
        }

        assert.isNotNull(err || null);

        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/release_lock',
                {
                    key: LOCK2,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Acquire lock for the third time
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/acquire_lock',
                {
                    key: LOCK2,
                    ttl: 3000,
                    timeout: 1000,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Release the lock
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/locks/release_lock',
                {
                    key: LOCK2,
                    client_id: client_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });
    });
});
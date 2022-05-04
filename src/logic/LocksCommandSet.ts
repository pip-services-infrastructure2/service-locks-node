import { CommandSet } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';

import { ILocksController } from './ILocksController';

export class LocksCommandSet extends CommandSet {
    private _controller: ILocksController;
    private _default_ttl: number = 10 * 1000;
    private _default_timeout: number = 60 * 1000;

    constructor(controller: ILocksController) {
        super();

        this._controller = controller;

        this.addCommand(this.makeGetLocks());
        this.addCommand(this.makeGetLockById());
        this.addCommand(this.makeTryAcquireLock());
        this.addCommand(this.makeAcquireLock());
        this.addCommand(this.makeReleaseLock());
    }

    private makeGetLocks(): ICommand {
        return new Command(
            'get_locks',
            new ObjectSchema(false)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            async (correlationId: string, args: Parameters) => {
                let filter = FilterParams.fromValue(args.get('filter'));
                let paging = PagingParams.fromValue(args.get('paging'));
                return await this._controller.getLocks(correlationId, filter, paging);
            }
        );
    }

    private makeGetLockById(): ICommand {
        return new Command(
            'get_lock_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('key', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let lockId = args.getAsString('key');
                return await this._controller.getLockById(correlationId, lockId);
            }
        );
    }

    private makeTryAcquireLock(): ICommand {
        return new Command(
            'try_acquire_lock',
            new ObjectSchema(false)
                .withRequiredProperty('key', TypeCode.String)
                .withRequiredProperty('ttl', TypeCode.Integer)
                .withRequiredProperty('client_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let key = args.getAsString('key');
                let ttl = args.getAsIntegerWithDefault('ttl', this._default_ttl);
                let client_id = args.getAsString('client_id');
                return await this._controller.tryAcquireLock(correlationId, key, ttl, client_id);
            }
        );
    }

    private makeAcquireLock(): ICommand {
        return new Command(
            'acquire_lock',
            new ObjectSchema(false)
                .withRequiredProperty('key', TypeCode.String)
                .withRequiredProperty('ttl', TypeCode.Integer)
                .withRequiredProperty('timeout', TypeCode.Integer)
                .withRequiredProperty('client_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let key = args.getAsString('key');
                let ttl = args.getAsIntegerWithDefault('ttl', this._default_ttl);
                let timeout = args.getAsIntegerWithDefault('timeout', this._default_timeout);
                let client_id = args.getAsString('client_id');
                return await this._controller.acquireLock(correlationId, key, ttl, timeout, client_id);
            }
        );
    }

    private makeReleaseLock(): ICommand {
        return new Command(
            'release_lock',
            new ObjectSchema(false)
                .withRequiredProperty('key', TypeCode.String)
                .withRequiredProperty('client_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let key = args.getAsString('key');
                let client_id = args.getAsString('client_id');
                return await this._controller.releaseLock(correlationId, key, client_id);
            }
        );
    }
}
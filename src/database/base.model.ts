import { Constructor, Model, QueryBuilderType, TransactionOrKnex } from 'objection';
import { CustomQueryBuilder } from './custom.query';

export class BaseModel extends Model {
    readonly id: number;
    created_at: string;
    created_by: number;
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;

    QueryBuilderType!: CustomQueryBuilder<this>;
    static QueryBuilder = CustomQueryBuilder;

    $beforeInsert() {
        this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const request = (global as any).requestContext;
        if(request?.user?.id){
            this.created_by = request.user.id;   
        }
    }

    $beforeUpdate() {
        this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const request = (global as any).requestContext;
        if(request?.user?.id){
            this.updated_by = request.user.id;   
        }
    }
}
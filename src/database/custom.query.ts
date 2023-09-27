import { Model, Page, QueryBuilder } from 'objection';

export class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<
  M,
  R
> {
  // These are necessary for typescript
  ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: CustomQueryBuilder<M, M>;
  MaybeSingleQueryBuilderType!: CustomQueryBuilder<M, M | undefined>;
  NumberQueryBuilderType!: CustomQueryBuilder<M, number>;
  PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>;

  find() {
    return this.where('deleted_at', null).orderBy('id', 'desc');
  }

  softDelete(id: number) {
    const patch = {};
    patch['deleted_at'] = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const request = (global as any).requestContext;
    if (request?.user?.id) {
      patch['deleted_by'] = request.user.id;
    }

    return this.findById(id).patch(patch);
  }

  filter(params: any) {
    const query = this;

    delete params.page;
    delete params.pageSize;
    delete params.sortBy;
    delete params.orderBy;

    Object.keys(params).forEach((key) => {
      if ((key as string).endsWith('id')) {
        query.where(key, params[key]);
        return;
      }
      if (typeof params[key] === 'string') {
        query.whereILike(key, `%${params[key]}%`);
      }
    });

    return query;
  }

  sort(params: any) {
    const query = this;

    if(params?.sortBy){
      query.orderBy(params?.sortBy, params?.orderBy || 'asc');
    }
    return query;
  }

  paginate(params: any) {
    if(params?.pageSize==='all'){
      return this
    }
    if (params?.page && params?.pageSize) {
      return this.page(params.page - 1, params.pageSize);
    }
    return this.page(0, 10);
  }
}

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

  filter(params: any) {
    const query = this;

    delete params.page;
    delete params.pageSize;

    Object.keys(params).forEach((key, index) => {
      if ((key as string).endsWith('id')) {
        query.where(key, params[key]);
        return;
      }
      if (typeof params[key] === 'string') {
        index === 0
          ? query.whereILike(key, `%${params[key]}%`)
          : query.andWhereILike(key, `%${params[key]}%`);
      }
    });

    return query;
  }
  // index === 0
  // ?
  // : query.andWhere(key, `%${params[key]}%`);
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

  paginate(params: any) {
    if (params?.page && params?.pageSize) {
      return this.page(params.page - 1, params.pageSize);
    }
    return this.page(0, 10);
  }
}

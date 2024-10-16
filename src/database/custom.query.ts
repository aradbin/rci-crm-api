import { Model, Page, QueryBuilder } from 'objection';

export class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  // These are necessary for typescript
  ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: CustomQueryBuilder<M, M>;
  MaybeSingleQueryBuilderType!: CustomQueryBuilder<M, M | undefined>;
  NumberQueryBuilderType!: CustomQueryBuilder<M, number>;
  PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>;

  find() {
    return this.where(`${this.modelClass().tableName}.deleted_at`, null).orderBy(
      `${this.modelClass().tableName}.id`,
      'desc',
    );
  }

  softDelete(id: number) {
    const patch = {};
    patch['deleted_at'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const request = (global as any).requestContext;
    if (request?.user?.id) {
      patch['deleted_by'] = request.user.id;
    }

    return this.findById(id).patch(patch);
  }

  filter(params: any) {
    const query = this;
    const filterParams = { ...params };

    delete filterParams.page;
    delete filterParams.pageSize;
    delete filterParams.sortBy;
    delete filterParams.orderBy;

    if (filterParams.hasOwnProperty('is_active')) {
      filterParams.is_active = filterParams.is_active === 'true' ? true : false;
    }

    Object.keys(filterParams).forEach((key) => {
      if ((key as string).endsWith('id') || typeof filterParams[key] === 'boolean') {
        query.where(`${this.modelClass().tableName}.${key}`, filterParams[key]);
        return;
      }
      if (typeof filterParams[key] === 'string') {
        query.whereILike(`${this.modelClass().tableName}.${key}`, `%${filterParams[key]}%`);
      }
    });

    return query;
  }

  sort(params: any) {
    const query = this;

    if (params?.sortBy) {
      query.orderBy(`${this.modelClass().tableName}.${params?.sortBy}`, params?.orderBy || 'asc');
    }
    return query;
  }

  paginate(params: any) {
    if (params?.page && params?.pageSize) {
      return this.page(params.page - 1, params.pageSize);
    }
    return this;
  }
}

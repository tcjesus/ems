import { DeleteResult, ObjectLiteral, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm'

class Relation {
  field: string
  alias?: string
  condition?: string
  join?: string
}

class QueryOptions {
  relations?: (Relation | string)[]
  select?: string[]
}

export abstract class DatabaseRepository<MODEL_TYPE extends ObjectLiteral, ID_TYPE> {
  constructor(
    protected repository: Repository<MODEL_TYPE>,
    protected table: string,
    protected defaultRelations: (Relation | string)[] = []
  ) { }

  async save(model: MODEL_TYPE): Promise<MODEL_TYPE> {
    return this.repository.save(model)
  }

  async saveMany(models: MODEL_TYPE[]): Promise<MODEL_TYPE[]> {
    return this.repository.save(models)
  }

  private addClauses = (query: SelectQueryBuilder<MODEL_TYPE>, values: object) => {
    Object.keys(values).forEach(key => {
      const field = key.split('.').pop() || key
      const isArray = Array.isArray(values[key])
      if (isArray) {
        query.andWhere(`${key} IN (:...${field})`, { [field]: values[key] })
      } else {
        query.andWhere(`${key} = :${field}`, { [field]: values[key] })
      }
    })
  }

  private addRelations = (query: SelectQueryBuilder<MODEL_TYPE>, relations?: (Relation | string)[]) => {
    const _relations = [...(relations || [])]
    if (!relations) {
      _relations.push(...this.defaultRelations)
    }

    if (!_relations?.length) return

    _relations.forEach(relation => {
      if (typeof relation === 'string') {
        query.leftJoinAndSelect(`${this.table}.${relation}`, relation)
        return
      }

      const alias = relation.alias || relation.field.split('.').pop() || relation.field
      if (relation.join === 'inner') {
        query.innerJoinAndSelect(`${relation.field}`, alias, relation.condition)
      } else {
        query.leftJoinAndSelect(`${relation.field}`, alias, relation.condition)
      }
    })
  }

  async findAll(options?: QueryOptions): Promise<MODEL_TYPE[]> {
    const { relations } = options || {}

    const query = this.repository
      .createQueryBuilder(this.table)

    this.addRelations(query, relations)

    return query.getMany()
  }

  async findById(id: ID_TYPE, options?: QueryOptions): Promise<MODEL_TYPE | null> {
    const { relations } = options || {}

    const query = this.repository
      .createQueryBuilder(this.table)
      .where(`${this.table}.id = :id`, { id })

    this.addRelations(query, relations)

    return query.getOne()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findOneBy(values: object, options?: QueryOptions): Promise<MODEL_TYPE | null> {
    const { relations } = options || {}

    const query = this.repository
      .createQueryBuilder(this.table)

    this.addClauses(query, values)
    this.addRelations(query, relations)

    return query.getOne()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findManyBy(values: object, options?: QueryOptions): Promise<MODEL_TYPE[]> {
    const { relations, select } = options || {}

    const query = this.repository
      .createQueryBuilder(this.table)

    if (select?.length) {
      query.select(select)
    }

    this.addClauses(query, values)
    this.addRelations(query, relations)

    return query.getMany()
  }

  async findManyById(ids: ID_TYPE[], options?: QueryOptions): Promise<MODEL_TYPE[]> {
    const { relations } = options || {}

    const query = this.repository
      .createQueryBuilder(this.table)
      .where(`${this.table}.id IN (:...ids)`, { ids })

    this.addRelations(query, relations)

    return query.getMany()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteBy(values: object, options?: QueryOptions): Promise<DeleteResult> {
    const { relations } = options || {}

    const query = this.repository
      .createQueryBuilder(this.table)

    this.addClauses(query, values)
    this.addRelations(query, relations)

    return query.delete().execute()
  }

  async delete(id: ID_TYPE): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder(this.table)
      .delete()
      .where(`${this.table}.id = :id`, { id })
      .execute();
  }

  async deleteMany(ids: ID_TYPE[]): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder(this.table)
      .delete()
      .where(`${this.table}.id IN (:...ids)`, { ids })
      .execute();
  }

  async softDelete(id: ID_TYPE): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder(this.table)
      .softDelete()
      .where(`${this.table}.id = :id`, { id })
      .execute();
  }

  async softDeleteMany(ids: ID_TYPE[]): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder(this.table)
      .softDelete()
      .where(`${this.table}.id IN (:...ids)`, { ids })
      .execute();
  }

  async restore(id: ID_TYPE): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder(this.table)
      .restore()
      .where(`${this.table}.id = :id`, { id })
      .execute();
  }

  async restoreMany(ids: ID_TYPE[]): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder(this.table)
      .restore()
      .where(`${this.table}.id IN (:...ids)`, { ids })
      .execute();
  }

  async nativeQuery(query: string, parameters?: any[]): Promise<any> {
    return this.repository.query(query, parameters)
  }
}

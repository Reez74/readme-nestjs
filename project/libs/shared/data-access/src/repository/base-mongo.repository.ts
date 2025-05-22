import { Document, Model, UpdateQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

import { Entity, StorableEntity, EntityFactory } from '@project/core';
import { Nullable } from '@project/helpers';
import { Repository } from './repository.interface';

export abstract class BaseMongoRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>,
  DocumentType extends Document
> implements Repository<T> {

  constructor(
    protected entityFactory: EntityFactory<T>,
    protected readonly model: Model<DocumentType>,
  ) {}


  protected createEntityFromDocument(document: DocumentType): Nullable<T> {
    if (!document) {
      return null;
    }

    const plainObject = document.toObject({ versionKey: false }) as ReturnType<T['toPOJO']>;
    return this.entityFactory.create(plainObject);
  }

  public async findById(id: T['id']): Promise<Nullable<T>> {
    const document = await this.model.findById(id).exec();
      if (!document) {
        return null;
    }

    return this.createEntityFromDocument(document);
  }

  public async save(entity: T): Promise<void> {
    const newEntity = new this.model(entity.toPOJO())
    await newEntity.save();
    entity.id = (newEntity._id as string).toString();
  }

  public async update(entity: T): Promise<void> {
    const updatedDocument = await this.model.findByIdAndUpdate(
      entity.id,
      entity.toPOJO() as UpdateQuery<DocumentType>,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }
  }

  public async deleteById(id: T['id']): Promise<void> {
    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }
  }
}

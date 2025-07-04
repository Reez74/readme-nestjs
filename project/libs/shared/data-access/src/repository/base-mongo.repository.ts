import { Document, Model, UpdateQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

import { Entity, StorableEntity, EntityFactory } from '@project/core';
import { Nullable } from '@project/helpers';
import { Repository } from './repository.interface';

interface WithId {
  id: string;
}

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

    const plainObject = document.toObject({
      getters: true,
      flattenObjectIds: true,
      versionKey: false
    }) as ReturnType<T['toPOJO']> & WithId;

    plainObject.id = (document._id as string).toString();
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

  public async deleteById(id: T['id']): Promise<void> {
    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }
  }

  public async update(entity: T): Promise<T> {
    const updatedDocument = await this.model.findByIdAndUpdate(
      entity.id,
      entity.toPOJO() as UpdateQuery<DocumentType>,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }

    const updatedEntity = this.createEntityFromDocument(updatedDocument);
    if (!updatedEntity) {
      throw new NotFoundException(`Entity with id ${entity.id} could not be created from document`);
    }

    return updatedEntity;
  }
}

import { ClassTransformOptions, plainToInstance } from 'class-transformer';

interface mongoConnectionOptions {
  username: string;
  password: string;
  host: string;
  port: number;
  databaseName: string;
  authDatabase: string;
}

interface rabbitConnectionOptions {
  username: string;
  password: string;
  host: string;
  port: number;
}

export function fillDTO<T, V>(
  DTOClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions,
): T;

export function fillDTO<T, V extends []>(
  DTOClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions,
): T[];

export function fillDTO<T, V>(
  DTOClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions,
): T | T[] {
  return plainToInstance(DTOClass, plainObject, {
    excludeExtraneousValues: true,
    ...options,
  });
}

export function getMongoConnectionString({
  username,
  password,
  host,
  port,
  databaseName,
  authDatabase
}: mongoConnectionOptions): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

export function getRabbitMQConnectionString({
  username,
  password,
  host,
  port
}: rabbitConnectionOptions): string {
  return `amqp://${username}:${password}@${host}:${port}`;
}

import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // --- using try catch if we want to catch the errors for all fields
    // => all errors will return with "Valition failed!" messages from catching
    // try {
    //   // --- this.schema come from the Constructor
    //   const parsedValue = this.schema.parse(value);
    //   return parsedValue;
    // } catch (err) {
    //   throw new BadRequestException('Validation failed!');
    // }

    // --- handle error for specific field
    const parsedValue = this.schema.safeParse(value);
    if (parsedValue.success) return parsedValue.data;

    throw new BadRequestException(parsedValue.error.format());
  }
}

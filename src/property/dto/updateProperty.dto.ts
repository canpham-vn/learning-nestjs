import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './createProperty.dto';

// --- Use nestjs mapped types library to map CreatePropertyDto
// --- Using PartialType: all fields in CreatePropertyDto will be optional
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

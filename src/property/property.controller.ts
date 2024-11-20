import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/createProperty.dto';
import { IdParamDto } from './dto/idParam.dto';
import { ParseIdPipe } from './pipes/parseIdPipe';
import { ZodValidationPipe } from './pipes/zodValidationPipe';
import { CreatePropertySchema } from './dto/createPropertyZod.dto';
import { HeadersDto } from './dto/headers.dto';
import { RequestHeader } from './pipes/request-header';
import { PropertyService } from './property.service';
import { UpdatePropertyDto } from './dto/updateProperty.dto';

@Controller('property')
export class PropertyController {
  // --- Don't create dependency, instead use Dependency Injection in NestJS ---
  // propertyService: PropertyService;
  // constructor() {
  //   this.propertyService = new PropertyService();
  // }

  constructor(private propertyService: PropertyService) {}

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    // @Query('sort', ParseBoolPipe) sort: boolean,
  ) {
    return this.propertyService.findOne(id);
  }

  @Post()
  // --- can use the UsePipes decorator to set the validation pipe ---
  @UsePipes(
    new ValidationPipe({
      // If have used global validation pipe, don't need to set for each controller
      // whitelist: true,
      // forbidNonWhitelisted: true,

      // --- The groups doesn't work on global validation pipe ---
      groups: ['create'],
      always: true,
    }),
  )

  // --- config UsePipes with zod library ---
  // @UsePipes(new ZodValidationPipe(CreatePropertySchema))

  // @HttpCode(202)
  create(@Body() dto: CreatePropertyDto) {
    return this.propertyService.create(dto);
  }

  //   @Patch(':id')
  //   update(
  //     // --- validate params by DTO ---
  //     // @Param() params: IdParamDto,

  //     // --- validate params by custom pipe ---
  //     @Param('id', ParseIdPipe) id: number,
  //     @Body()
  //     // // Or set inside the Body decorator to set the validation pipe
  //     // new ValidationPipe({
  //     //   // --- If have used global validation pipe, don't need to set for each controller ---
  //     //   // whitelist: true,
  //     //   // forbidNonWhitelisted: true,

  //     //   // --- The groups doesn't work on global validation pipe ---
  //     //   groups: ['update'],
  //     //   always: true,
  //     // }),
  //     body: CreatePropertyDto,
  //     @RequestHeader(new ValidationPipe({ validateCustomDecorators: true }))
  //     host: HeadersDto,
  //   ) {
  //     console.log(typeof id);
  //     return body;
  //   }
  // }

  @Patch(':id')
  update(@Param('id', ParseIdPipe) id: number, @Body() dto: UpdatePropertyDto) {
    return this.propertyService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIdPipe) id: number) {
    return this.propertyService.delete(id);
  }
}

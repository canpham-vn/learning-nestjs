import {
  Body,
  Controller,
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

@Controller('property')
export class PropertyController {
  @Get()
  findAll() {
    return 'All Properties';
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('sort', ParseBoolPipe) sort: boolean,
  ) {
    console.log(typeof id);
    console.log(typeof sort);

    return id;
  }

  @Post()
  // --- can use the UsePipes decorator to set the validation pipe ---
  // @UsePipes(
  //   new ValidationPipe({
  //     // If have used global validation pipe, don't need to set for each controller
  //     // whitelist: true,
  //     // forbidNonWhitelisted: true,

  //     // --- The groups doesn't work on global validation pipe ---
  //     groups: ['create'],
  //     always: true,
  //   }),
  // )

  // --- config UsePipes with zod library ---
  @UsePipes(new ZodValidationPipe(CreatePropertySchema))

  // @HttpCode(202)
  create(@Body() body: CreatePropertyDto) {
    console.log({ body });
    return body;
  }

  @Patch(':id')
  update(
    // --- validate params by DTO ---
    // @Param() params: IdParamDto,

    // --- validate params by custom pipe ---
    @Param('id', ParseIdPipe) id: number,
    @Body(
      // Or set inside the Body decorator to set the validation pipe
      new ValidationPipe({
        // --- If have used global validation pipe, don't need to set for each controller ---
        // whitelist: true,
        // forbidNonWhitelisted: true,

        // --- The groups doesn't work on global validation pipe ---
        groups: ['update'],
        always: true,
      }),
    )
    body: CreatePropertyDto,
    @Headers('host') host,
  ) {
    // console.log(typeof id);
    // return body;

    return host;
  }
}

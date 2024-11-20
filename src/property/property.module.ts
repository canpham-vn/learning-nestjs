import { Module, ValidationPipe } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { APP_PIPE } from '@nestjs/core';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';

@Module({
  // --- Register the repository of the property entity in the property module ---
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertyController],

  // --- can config the validation for specific module
  // --- if we use the zod library to handle validation, we need to remove the config of global validation pipe
  providers: [
    {
      provide: APP_PIPE,
      // --- if we don't want to add any option, we can use the useClass option ---
      // useClass: ValidationPipe

      // --- if we want to pass the validation option
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        // --- because the params on the URL is string type, and we use the DTO to validate them
        // but the params can be another type, so we need to config the transform option
        // ex: validate the id param will be number, but id param we pass on the URL is always string => error type!
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    PropertyService,
  ],
})
export class PropertyModule {}

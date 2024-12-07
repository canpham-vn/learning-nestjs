import { Faker } from '@faker-js/faker';
import { PropertyFeature } from '../entities/propertyFeature.entity';
import { setSeederFactory } from 'typeorm-extension';

export const PropertyFeatureFactory = setSeederFactory(
  PropertyFeature,
  (faker: Faker) => {
    const propertyFeature = new PropertyFeature();
    propertyFeature.area = faker.number.int({ min: 25, max: 2500 });
    propertyFeature.bathrooms = faker.number.int({ min: 1, max: 3 });
    propertyFeature.bedrooms = faker.number.int({ min: 1, max: 3 });
    propertyFeature.parkingSpots = faker.number.int({ min: 1, max: 3 });
    propertyFeature.hasBalcony = faker.datatype.boolean();
    propertyFeature.hasGardenYard = faker.datatype.boolean();
    propertyFeature.hasSwimmingPool = faker.datatype.boolean();

    return propertyFeature;
  },
);

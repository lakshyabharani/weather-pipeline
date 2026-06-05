import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherSnapshot } from './weather.entity';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherSnapshot])],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}

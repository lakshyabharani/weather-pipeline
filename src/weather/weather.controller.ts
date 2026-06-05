import { Controller, Get, Post, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  // GET /api/weather/latest — get latest snapshot for all cities
  @Get('latest')
  getLatest() {
    return this.weatherService.getLatest();
  }

  // GET /api/weather/history?city=Washington DC&limit=24
  @Get('history')
  getHistory(@Query('city') city: string, @Query('limit') limit?: number) {
    return this.weatherService.getHistory(city, limit ?? 24);
  }

  // GET /api/weather/cities — list all tracked cities
  @Get('cities')
  getCities() {
    return this.weatherService.getCities();
  }

  // POST /api/weather/fetch — manually trigger a fetch right now
  @Post('fetch')
  fetchNow() {
    return this.weatherService.fetchAllCitiesNow();
  }
}

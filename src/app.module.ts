import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5435,
        username: 'postgres',
        password: 'postgres123',
        database: 'weatherpipeline',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

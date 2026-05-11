import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './schemas/company.entity';
import { Job } from '../jobs/schemas/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Job])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}

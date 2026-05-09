import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './schemas/application.entity';
import { User } from '../user/schemas/user.entity';
import { Job } from '../jobs/schemas/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, User, Job])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './schemas/application.entity';
import { User } from '../user/schemas/user.entity';
import { Job } from '../jobs/schemas/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async applyToJob(userId: number, createApplicationDto: CreateApplicationDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Authenticated user not found');
    }

    const job = await this.jobRepository.findOne({ where: { id: createApplicationDto.jobId }, relations: ['company'] });
    if (!job) {
      throw new BadRequestException('Job not found');
    }

    const existing = await this.applicationRepository.findOne({
      where: { user: { id: user.id }, job: { id: job.id } },
      relations: ['user', 'job'],
    });
    if (existing) {
      throw new BadRequestException('You have already applied to this job');
    }

    const application = this.applicationRepository.create({
      user,
      job,
      coverLetter: createApplicationDto.coverLetter,
    });

    return this.applicationRepository.save(application);
  }

  async getApplicationsForUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Authenticated user not found');
    }

    return this.applicationRepository.find({
      where: { user: { id: user.id } },
      relations: ['job', 'job.company'],
    });
  }
}

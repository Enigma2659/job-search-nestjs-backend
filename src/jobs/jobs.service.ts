import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './schemas/job.entity';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async getAllJobs(query?: any) {
    return await this.jobRepository.find({ relations: ['company'] });
  }

  async getJobById(id: number) {
    const job = await this.jobRepository.findOne({ where: { id }, relations: ['company'] });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async getJobByTitle(title: string) {
    const job = await this.jobRepository.findOne({ where: { title }, relations: ['company'] });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  private parseDdMmYyyyToDate(value: string): Date {
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  async createJob(createJobDto: CreateJobDto) {
    const jobData: any = {
      ...createJobDto,
      dueDate: this.parseDdMmYyyyToDate(createJobDto.dueDate),
    };

    const newJob = this.jobRepository.create(jobData);
    return await this.jobRepository.save(newJob);
  }

  async updateJob(id: number, updateJobDto: UpdateJobDto) {
    const jobData: any = { ...updateJobDto };
    if (jobData.dueDate) {
      jobData.dueDate = this.parseDdMmYyyyToDate(jobData.dueDate);
    }

    await this.jobRepository.update(id, jobData);
    const updatedJob = await this.jobRepository.findOne({ where: { id }, relations: ['company'] });
    if (!updatedJob) {
      throw new NotFoundException('Job not found');
    }
    return updatedJob;
  }

  async deleteJob(id: number) {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Job not found');
    }
    return { message: 'Job deleted' };
  }

  async deleteByName(title: string) {
    const result = await this.jobRepository.delete({ title });
    if (result.affected === 0) {
      throw new NotFoundException('Job not found');
    }
    return { message: 'Job deleted' };
  }

  
  async postJobs(
    id: string,
    job: { id: string; name: string; category: string },
  ) {
  
    return { message: 'Jobs posted', companyId: id, job };
  }
}

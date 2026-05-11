import { Body, Controller, Get, Post, Put, Delete, Param, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createJob(@Body() createJobDto: CreateJobDto) {
    return await this.jobsService.createJob(createJobDto);
  }

  @Get()
  async getAllJobs(@Query() query: any) {
    return await this.jobsService.getAllJobs(query);
  }

  @Get('title/:title')
  async getJobByTitle(@Param('title') title: string) {
    return await this.jobsService.getJobByTitle(title);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return await this.jobsService.getJobById(parseInt(id));
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return await this.jobsService.updateJob(parseInt(id), updateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return await this.jobsService.deleteJob(parseInt(id));
  }

  @Delete('name/:title')
  async deleteByName(@Param('title') title: string) {
    return await this.jobsService.deleteByName(title);
  }

  @Post(':id/post')
  @UsePipes(new ValidationPipe())
  async postJobs(@Param('id') id: string, @Body() job: { id: string, name: string, category: string }) {
    return await this.jobsService.postJobs(id, job);
  }
}

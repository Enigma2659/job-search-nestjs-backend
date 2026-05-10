import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job } from './schemas/job.schema';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const mockJobModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findOneAndDelete: jest.fn(),
      new: jest.fn().mockResolvedValue({}),
      constructor: jest.fn().mockResolvedValue({}),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        JobsService,
        {
          provide: getModelToken(Job.name),
          useValue: mockJobModel,
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

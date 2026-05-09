import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './schemas/company.entity';
import { CreateCompanyDto, UpdateCompanyDto, PatchCompanyDto } from './dto/company.dto';
import { Job } from '../jobs/schemas/job.entity';
import { CreateJobDto } from '../jobs/dto/job.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async getAllCompanies(query?: any) {
    return await this.companyRepository.find();
  }

  async getCompanyById(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const newCompany = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(newCompany);
  }

  async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(id, updateCompanyDto);
    const updatedCompany = await this.companyRepository.findOne({ where: { id } });
    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }
    return updatedCompany;
  }

  async patchCompany(id: number, patchCompanyDto: PatchCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    
    // Only update jobDescription field
    if (patchCompanyDto.jobDescription !== undefined) {
      await this.companyRepository.update(id, { jobDescription: patchCompanyDto.jobDescription });
    }

    return await this.companyRepository.findOne({ where: { id } });
  }

  async deleteCompany(id: number) {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Company not found');
    }
    return { message: 'Company deleted' };
  }

  async deleteByName(name: string) {
    const result = await this.companyRepository.delete({ name });
    if (result.affected === 0) {
      throw new NotFoundException('Company not found');
    }
    return { message: 'Company deleted' };
  }

  async postJob(companyId: number, createJobDto: CreateJobDto, authUser: any) {
    if (!authUser || authUser.type !== 'company' || authUser.id !== companyId) {
      throw new ForbiddenException('Only the authenticated company may post jobs here');
    }

    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const dueDateParts = createJobDto.dueDate.split('/').map(Number);
    const dueDate = new Date(dueDateParts[2], dueDateParts[1] - 1, dueDateParts[0]);

    const newJob = this.jobRepository.create({
      title: createJobDto.title,
      requirements: createJobDto.requirements,
      description: createJobDto.description,
      dueDate,
      company,
    });

    return this.jobRepository.save(newJob);
  }
}

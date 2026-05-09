import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  PatchCompanyDto,
} from './dto/company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateJobDto } from '../jobs/dto/job.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  async getAllCompanies(@Query() query: any) {
    return await this.companiesService.getAllCompanies(query);
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    return await this.companiesService.getCompanyById(parseInt(id));
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companiesService.updateCompany(
      parseInt(id),
      updateCompanyDto,
    );
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async patchCompany(
    @Param('id') id: string,
    @Body() patchCompanyDto: PatchCompanyDto,
  ) {
    return await this.companiesService.patchCompany(
      parseInt(id),
      patchCompanyDto,
    );
  }

  @Delete(':id')
  async deleteCompany(@Param('id') id: string) {
    return await this.companiesService.deleteCompany(parseInt(id));
  }

  @Delete('name/:name')
  async deleteByName(@Param('name') name: string) {
    return await this.companiesService.deleteByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/jobs')
  @UsePipes(new ValidationPipe({ transform: true }))
  async postJob(
    @Param('id') id: string,
    @GetUser('id') authUserId: number,
    @GetUser('type') authUserType: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    return await this.companiesService.postJob(parseInt(id), createJobDto, {
      id: authUserId,
      type: authUserType,
    });
  }
}

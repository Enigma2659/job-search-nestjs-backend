import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async applyToJob(
    @GetUser('id') userId: number,
    @Body() createApplicationDto:  CreateApplicationDto,
  ) {
    return this.applicationsService.applyToJob(userId, createApplicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyApplications(@GetUser('id') userId: number) {
    return this.applicationsService.getApplicationsForUser(userId);
  }
}

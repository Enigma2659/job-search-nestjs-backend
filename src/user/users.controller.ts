import { Body, Controller, Get, Post, Put, Delete, Param, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getAllUsers(@Query() query: any) {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(parseInt(id));
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.usersService.deleteById(parseInt(id));
  }

  @Delete('name/:username')
  deleteByName(@Param('username') username: string) {
    return this.usersService.deleteByName(username);
  }

  @Get(':id/search')
  searchJobs(@Param('id') id: string, @Query() query: { id?: string, name?: string, category?: string }) {
    return this.usersService.searchJobs(id, query);
  }

  @Post(':id/apply')
  @UsePipes(new ValidationPipe())
  applyForJob(@Param('id') id: string, @Body() application: { username: string, email: string, DoB: string, password: string, jobid: string, jobname: string, jobcategory: string }) {
    return this.usersService.applyForJob(id, application);
  }
}
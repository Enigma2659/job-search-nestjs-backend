import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schemas/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(query?: any) {
    return await this.userRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new NotFoundException('Could not find the user');
  }

  async createUser(createUserDto: CreateUserDto) {
    const { Firstname, surname, DoB, password } = createUserDto;
    const username = `${Firstname.charAt(0)}${surname}`.toLowerCase();
    const email = `${Firstname.toLowerCase()}.${surname.toLowerCase()}@example.com`;

    const newUser = this.userRepository.create({
      Firstname,
      surname,
      username,
      email,
      DoB: new Date(DoB),
      password,
    });
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { Firstname, surname, ...otherUpdates } = updateUserDto;

    // If Firstname or surname are being updated, regenerate username and email
    if (Firstname || surname) {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Could not find the user to update');
      }

      const newFirstname = Firstname || user.Firstname;
      const newSurname = surname || user.surname;
      const username = `${newFirstname.charAt(0)}${newSurname}`.toLowerCase();
      const email = `${newFirstname.toLowerCase()}.${newSurname.toLowerCase()}@example.com`;

      await this.userRepository.update(id, {
        ...otherUpdates,
        Firstname: newFirstname,
        surname: newSurname,
        username,
        email,
      });

      return await this.userRepository.findOne({ where: { id } });
    }

    await this.userRepository.update(id, otherUpdates);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Could not find the user to update');
    }
    return user;
  }

  async deleteById(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Could not find the user to delete');
    }
    return { message: 'User deleted' };
  }

  async deleteByName(username: string) {
    const result = await this.userRepository.delete({ username });
    if (result.affected === 0) {
      throw new NotFoundException('Could not find the user to delete');
    }
    return { message: 'User deleted' };
  }

  // Note: search jobs and apply might need to interact with jobs service
  // For now, placeholder
  async searchJobs(id: string, query: { id?: string, name?: string, category?: string }) {
    // This would typically call jobs service
    // Placeholder implementation
    return { message: 'Search jobs for user', userId: id, query };
  }

  async applyForJob(id: string, application: { username: string, email: string, DoB: string, password: string, jobid: string, jobname: string, jobcategory: string }) {
    // Placeholder implementation
    return { message: 'Applied for job', userId: id, application };
  }
}

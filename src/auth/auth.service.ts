import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/schemas/user.entity';
import { Company } from '../companies/schemas/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { Firstname, Lname, DoB, name, email, password } = signUpDto;

    let existing;
    let created;
    let token;

    if (Firstname && Lname && DoB && email) {
      // User signup
      existing = await this.usersRepository.findOne({ where: { email } });
      if (existing) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      created = this.usersRepository.create({
        Firstname,
        surname: Lname,
        username: `${Firstname}${Lname}`,
        email,
        DoB: new Date(DoB),
        password: hashedPassword,
      });

      await this.usersRepository.save(created);
      token = this.jwtService.sign({ id: created.id.toString(), type: 'user' });
    } else if (name) {
      // Company signup
      existing = await this.companiesRepository.findOne({ where: { name } });
      if (existing) {
        throw new ConflictException('Company name already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      created = this.companiesRepository.create({
        name,
        location: '',
        jobDescription: '',
        password: hashedPassword,
      });

      await this.companiesRepository.save(created);
      token = this.jwtService.sign({ id: created.id.toString(), type: 'company' });
    } else {
      throw new ConflictException('Invalid signup data');
    }

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, email, password } = loginDto;

    let user;
    let type;

    if (email) {
      user = await this.usersRepository.findOne({ where: { email } });
      type = 'user';
    } else if (username) {
      user = await this.companiesRepository.findOne({ where: { name: username } });
      type = 'company';
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id.toString(), type });

    return { token };
  }

  async validateUser(username: string, password: string): Promise<any> {
    let user;
    let type;

    if (username.includes('@')) {
      user = await this.usersRepository.findOne({ where: { email: username } });
      type = 'user';
    } else {
      user = await this.companiesRepository.findOne({ where: { name: username } });
      type = 'company';
    }

    if (!user) {
      return null;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return null;
    }

    const { password: passwordValue, ...result } = user;
    return { ...result, id: user.id.toString(), type };
  }

  async loginUser(user: { id: string; type: string }): Promise<{ token: string }> {
    const token = this.jwtService.sign({ id: user.id.toString(), type: user.type });
    return { token };
  }

  async logout() {
    // For JWT, logout is handled on client side
    return { message: 'Logged out' };
  }

  async me(token: string) {
    // Decode token to get user info
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type === 'user') {
        return await this.usersRepository.findOne({ where: { id: parseInt(payload.id) } });
      } else {
        return await this.companiesRepository.findOne({ where: { id: parseInt(payload.id) } });
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
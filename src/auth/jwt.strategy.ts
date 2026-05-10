import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/schemas/user.entity';
import { Company } from '../companies/schemas/company.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload) {
    const { id, type } = payload;

    if (type === 'company') {
      const company = await this.companiesRepository.findOne({ where: { id: parseInt(id) } });
      if (!company) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return { ...company, type: 'company' };
    }

    const user = await this.usersRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    const { password, ...safeUser } = user as any;
    return { ...safeUser, type: 'user' };
  }
}

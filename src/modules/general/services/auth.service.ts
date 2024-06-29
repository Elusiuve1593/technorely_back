import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { Repository } from 'typeorm';
import { SignInDTO } from '../dto/auth/signIn.dto';
import { SignUpDTO } from '../dto/auth/signUp.dto';
import { TokenDTO } from '../dto/auth/token.dto';
import { Auth } from '../entity/auth.entity';
import { BlackListService } from './black-listed.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly bcrypt: BcryptService,
    private readonly jwtService: JwtService,
    private readonly blackListService: BlackListService,
  ) {}

  async createAdmin(signUp: SignUpDTO): Promise<void> {
    const existingAdmin = await this.authRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await this.bcrypt.hashPassword(signUp.password);

      const newAdmin = this.authRepository.create({
        ...signUp,
        email: 'admin@example.com',
        password: hashedPassword,
        roles: ['admin'],
      });

      const saveAdmin = await this.authRepository.save(newAdmin);

      saveAdmin.owner = saveAdmin.id.toString();

      await this.authRepository.save(saveAdmin);

      console.log('Admin has successfully created!');
    } else {
      console.log('Admin has already existed!');
    }
  }

  async signUp(signUp: SignUpDTO): Promise<{
    statusCode: number;
    message: string;
  }> {
    const hashedPassword = await this.bcrypt.hashPassword(signUp.password);
    const signUpUser = new Auth({
      ...signUp,
      image: '',
      password: hashedPassword,
    });
    const saveUser = await this.authRepository.save(signUpUser);

    saveUser.owner = saveUser.id.toString();

    await this.authRepository.save(saveUser);

    return {
      statusCode: 201,
      message: `The user with email: ${saveUser.email} has been successfully created!`,
    };
  }

  existMail(email: string): Promise<Auth> {
    return this.authRepository.findOne({ where: { email } });
  }

  async signIn({ email, password }: SignInDTO): Promise<TokenDTO | null> {
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User with ${email} is not found`);

    user.owner = user.id.toString();

    const comparePassword = await this.bcrypt.comparePassword(
      password,
      user.password,
    );

    if (!comparePassword) throw new UnauthorizedException('Incorrect password');

    const payload = { sub: user.id, userName: user.email, roles: user.roles };

    const { id } = user;

    return {
      id,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }

  async logout(
    token: string,
  ): Promise<{ message: string; statusCode: number }> {
    await this.blackListService.blackListToken(token.split(' ')[1]);

    return { message: 'Logged out successfully', statusCode: 200 };
  }
}

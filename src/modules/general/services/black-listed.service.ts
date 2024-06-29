import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlackListedToken } from '../entity/blacklisted-token.entity';

@Injectable()
export class BlackListService {
  constructor(
    @InjectRepository(BlackListedToken)
    private readonly blackListedTokenRepository: Repository<BlackListedToken>,
  ) {}

  async blackListToken(token: string): Promise<BlackListedToken> {
    const addToBlackList = new BlackListedToken({ token });

    return await this.blackListedTokenRepository.save(addToBlackList);
  }

  async isTokenBlackListed(token: string): Promise<boolean> {
    const tokenExist = await this.blackListedTokenRepository.findOne({
      where: { token },
    });
    return !!tokenExist;
  }
}

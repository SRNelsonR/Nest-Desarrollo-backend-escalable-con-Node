import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

import { SeedService } from './seed.service';
import { User } from '../auth/entities/user.entity';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth( ValidRoles.admin )
  executeSeed(
    // @GetUser() user: User
  ) {
    // return this.seedService.runSeed(user);
    return this.seedService.runSeed();
  }

}
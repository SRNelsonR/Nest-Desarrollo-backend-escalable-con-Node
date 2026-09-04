import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    // return 'This action adds a new auth';
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });
      const savedUser = await this.userRepository.save( user );
      // Esta instrucción da error
      // delete user.password;
      // Solución al error anterior
      const { password: _, ...userWihoutPass } = savedUser;
      
      return userWihoutPass;
      // TODO: Retornar el JWT de acceso

    } catch (error) {
      // console.log(error);
      this.handelDBErrors(error);
    }
  }

  private handelDBErrors( error: any ): never {
    if( error.code === '23505' )
        throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

}
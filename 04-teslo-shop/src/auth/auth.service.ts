import { 
  BadRequestException, Injectable, InternalServerErrorException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

// import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    private readonly jwtService: JwtService,
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
      
      return {
      ...userWihoutPass,
      // token: this.getJwtToken({ email: user.email }),
      token: this.getJwtToken({ id: user.id }),
    };
      // TODO: Retornar el JWT de acceso

    } catch (error) {
      // console.log(error);
      this.handelDBErrors(error);
    }
  }

  async login( loginUserDto: LoginUserDto ){
    
    loginUserDto.email = loginUserDto.email.toLowerCase().trim();

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      // select: { email: true, password: true },
      select: { email: true, password: true, id: true }, //! OJO!
    });

    if( !user )
      throw new UnauthorizedException('Credentials are not valid (email)');

    if( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    // console.log({ user });

    return {
      ...user,
      // token: this.getJwtToken({ email: user.email }),
      token: this.getJwtToken({ id: user.id }),
    };
    // TODO: retornar JWT -- Hecho

    // try {
      
    // } catch (error) {
    //   this.handelDBErrors(error);
    // }
  }

  private getJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );

    return token;
  }

  private handelDBErrors( error: any ): never {
    if( error.code === '23505' )
        throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

}
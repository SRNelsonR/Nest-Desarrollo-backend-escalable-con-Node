import { 
  Controller, Get, Post, Body, UseGuards, Req, Headers,
  SetMetadata
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
// import { GetUser } from './decorators/get-user.decorators';
import { GetUser, GetRawHeaders } from './decorators';

// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    // @GetUser(['email', 'role', 'fullName']) user: User
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {

    // console.log( { user: request.user } );
    // console.log({ user });
    // console.log( request );

    return {
      ok: true,
      message: 'Hola Mundo Private',
      // user: { name: 'Oscar' },
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  // Verificacion de roles
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user,
    }
  }

}
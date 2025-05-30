import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDTO } from '@project/helpers';
import { MongoIdValidationPipe } from '@project/pipes';

import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';
import { LoggedUserRDO } from '../rdo/logged-user.rdo';
import { UserRDO } from '../rdo/user.rdo';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  AuthUserApiOperation,
  AuthUserApiParam,
  AuthUserApiResponse
} from './authentication.constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService
  ) {}

  @ApiOperation(AuthUserApiOperation.Register)
  @ApiResponse(AuthUserApiResponse.Created)
  @ApiResponse(AuthUserApiResponse.Exists)
  @Post('register')
  public async create(@Body() dto: CreateUserDTO) {
    const newUser = await this.authService.registerUser(dto);
    return fillDTO(UserRDO, newUser.toPOJO());
  }

  @ApiOperation(AuthUserApiOperation.Login)
  @ApiResponse(AuthUserApiResponse.LoggedSuccess)
  @ApiResponse(AuthUserApiResponse.LoggedError)
  @Post('login')
  public async login(@Body() dto: LoginUserDTO) {
    const verifiedUser = await this.authService.verifyUser(dto);
    const userToken = await this.authService.createUserToken(verifiedUser);
    return fillDTO(LoggedUserRDO, { ...verifiedUser.toPOJO(), ...userToken });
  }

  @ApiOperation(AuthUserApiOperation.User)
  @ApiResponse(AuthUserApiResponse.Found)
  @ApiResponse(AuthUserApiResponse.NotFound)
  @ApiParam(AuthUserApiParam.UserId)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.authService.getUser(id);
    return fillDTO(UserRDO, existUser.toPOJO());
  }
}

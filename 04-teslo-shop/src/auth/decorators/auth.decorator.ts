import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    // SetMetadata('roles', roles),
    // RoleProtected( ValidRoles.superUser, ValidRoles.admin ),
    RoleProtected( ...roles ),
    UseGuards( AuthGuard(), UserRoleGuard ),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );

}
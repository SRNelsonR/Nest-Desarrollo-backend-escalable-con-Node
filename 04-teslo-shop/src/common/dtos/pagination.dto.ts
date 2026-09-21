import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    // Transformar a number, por defecto es texto
    // Este Type seria opcional si en el main agregamos pa propiedad enableImplicitConversion: true
    @Type( () => Number )
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'How many rows do you want to skip'
    })
    @IsOptional()
    // @IsPositive()
    @Min(0)
    @Type( () => Number )
    offset?: number;

}
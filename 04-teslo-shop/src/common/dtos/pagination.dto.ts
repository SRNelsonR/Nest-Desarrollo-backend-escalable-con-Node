import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    // Transformar a number, por defecto es texto
    // Este Type seria opcional si en el main agregamos pa propiedad enableImplicitConversion: true
    @Type( () => Number )
    limit?: number;

    @IsOptional()
    // @IsPositive()
    @Min(0)
    @Type( () => Number )
    offset?: number;
}
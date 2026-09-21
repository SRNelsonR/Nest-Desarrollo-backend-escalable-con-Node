// import { PartialType } from '@nestjs/mapped-types';
// Al tomar el PartialType de mapped-types no toma los decoradores, por eso se toma de swagger en su lugar
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

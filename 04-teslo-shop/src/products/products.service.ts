import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  // Lo mejor es usar el patron repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {

    // Usualmente no se quiere hacer de esta manera, Lo mejor es usar el patron repositorio
    // const producto = new Product();

    try {

      // if( !createProductDto.slug ){
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ', '_')
      //   .replaceAll("'", '');
      // } else {
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ', '_')
      //   .replaceAll("'", '');
      // }

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );

      return product;
    } catch ( error) {
      this.handleDBExceptions(error);
    }

    // return 'This action adds a new product';
  }

  // TODO: Paginar - Ya resuelto
  findAll( paginationDto: PaginationDto ) {
    // return `This action returns all products`;
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne( term: string ) {
    // return `This action returns a #${id} product`;

    const product = await this.productRepository.findOneBy({id: term});
    if( !product ) 
        throw new NotFoundException(`Product with id ${ term } not found.`);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    // return `This action removes a #${id} product`;

    const product = await this.findOne(id);
    await this.productRepository.remove( product );

    return `Product with id ${id} deleted`;
  }

  private handleDBExceptions ( error: any ) {
    // console.log(error);
      if( error.code === '23505' )
        throw new BadRequestException(error.detail);

      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

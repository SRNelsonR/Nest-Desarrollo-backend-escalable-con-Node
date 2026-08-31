import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

// import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  // Lo mejor es usar el patron repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
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

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        // No es necesario enviar el id del producto porque typeorm infiere el id al crear el producto
        images: images.map( image => this.productImageRepository.create({ url: image }) )
      });
      await this.productRepository.save( product );

      return { ...product, images: images };
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

    // const product = await this.productRepository.findOneBy({id: term});

    // let product: Product;
    let product;

    if( isUUID( term ) ){
      product = await this.productRepository.findOneBy({id: term});
    } else {
      // product = await this.productRepository.findOneBy({slug: term});
      // const queryBuilder = this.productRepository.createQueryBuilder();
      // product = await queryBuilder
      //   .where('LOWER(title) =LOWER(:title) or slug =:slug', {
      //     title: term,
      //     slug: term
      //   }).getOne();
      
      // Solucion
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }

    if( !product ) 
        throw new NotFoundException(`Product with ${ term } not found.`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // return `This action updates a #${id} product`;
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    });

    if ( !product ) throw new NotFoundException( `Product whit id: ${id} not found` );

    try {
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
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

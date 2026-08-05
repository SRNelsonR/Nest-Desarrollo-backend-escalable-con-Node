import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Brand } from './entities/brand.entity';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {

  private brands: Brand[] = [
    // {
    //   id: uuid(),
    //   name: 'Toyota',
    //   createdAt: new Date().getTime(),
    // }
  ];

  create(createBrandDto: CreateBrandDto) {
    // return 'This action adds a new brand';

    const { name } = createBrandDto;

    const brand: Brand = {
      id: uuid(),
      // name: createBrandDto.name,
      name: name.toLowerCase(),
      createdAt: new Date().getTime(),
    }

    this.brands.push(brand);

    return brand;
  }

  findAll() {
    // return `This action returns all brands`;
    return this.brands;
  }

  findOne(id: string) {
    // return `This action returns a #${id} brand`;
    const brand = this.brands.find( brand => brand.id === id );
    if ( !brand )
        throw new NotFoundException(`Brand with id "${id}" not found`);

    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    // return `This action updates a #${id} brand`;
    let brandDB = this.findOne( id );
    this.brands = this.brands.map( brand => {
      if( brand.id === id ){
        brandDB.updatedAt = new Date().getTime();
        brandDB = { ...brandDB, ...updateBrandDto };
        // console.log("BrandDB", brandDB);
        return brandDB;
      }
      // console.log("Brand", brand);
      return brand;
    });

    return brandDB;
  }

  remove(id: string) {
    // return `This action removes a #${id} brand`;
    this.brands = this.brands.filter( brand => brand.id !== id )
  }

  fillBrandsWithSeedData( brands: Brand[] ) {
    this.brands = brands;
  }
  
}
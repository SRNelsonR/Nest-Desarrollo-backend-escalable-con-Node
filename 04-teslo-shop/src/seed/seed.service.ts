import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ){

  }
  
  // async runSeed( user: User ){
  async runSeed(){

    await this.deleteTables();
    const adminUser = await this.insertUsers();
    // await this.insertNewProducts( user );
    await this.insertNewProducts( adminUser );

    return 'SEED EXECUTED';
  }

  private async deleteTables(){

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
            .delete()
            // .where({})
            .execute()

    // Otra forma de hacerlo, eliminando desde aqui


  }

  private async insertUsers(){
    
    const seedUsers = initialData.users;

    // Otra forma en lugar de areglo de promesas
    // insert multilinea insert into (....) (....)

    // Encriptar la contraseña
    // const users: User[] = [];
    // seedUsers.forEach( user => {
    //   const { password, ...restData } = user;
    //   // users.push( this.userRepository.create(user) );
    //   users.push( this.userRepository.create({
    //     ...restData,
    //     password: bcrypt.hashSync( password, 10 )
    //   }));
    // });

    // const dbUsers = await this.userRepository.save( users );

    // Encriptar la contraseña en el seed data
    const users: User[] = [];
    seedUsers.forEach( user => {
      users.push( this.userRepository.create(user) );
    });

    const dbUsers = await this.userRepository.save( seedUsers );

    return dbUsers[0];

  }

  // private async insertNewProducts( user: User ){
  private async insertNewProducts( user: User ){
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    // De esta forma no funciona
    // const insertPromises = [];
    // products.forEach( product => {
    //   insertPromises.push( this.productsService.create( product ) );
    // });

    // Otra forma con any, no recomendado el tipo de dato any
    // const insertPromises: Promise<any>[] = [];
    // products.forEach( product => {
    //   insertPromises.push( this.productsService.create( product ) );
    // });

    // Una mejor solución
    const insertPromises = products.map( product => 
      this.productsService.create(product, user)
    );

    await Promise.all( insertPromises );

    return true;
  }
  
}

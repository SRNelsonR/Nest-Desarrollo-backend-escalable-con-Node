import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// import axios, { AxiosInstance } from 'axios';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ){}

  async executeSeed(){

    await this.pokemonModel.deleteMany(); // Delete * from pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // const insertPromisesArray: Promise<Pokemon>[] = [];
    const pokemonToInsert: { name:string, no:number }[] = [];

    data.results.forEach( ({ name, url }) => {
      // console.log({ name, url });
      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];
      // console.log({ name, no });
      // try {
      //   const pokemon = await this.pokemonModel.create( { name, no } );
      //   return pokemon;
      // } catch ( error: any ) {
      //   if( error.code === 11000 ){
      //     throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
      //   }
    
      //   // console.log(error);
      //   throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
      // }
      // const pokemon = await this.pokemonModel.create( { name, no } );
      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name, no })
      // );
      pokemonToInsert.push({ name, no });// [{ name:bulbasaur, no:1 }];
    });

    // await Promise.all(insertPromisesArray);
    await this.pokemonModel.insertMany( pokemonToInsert );

    return 'Seed Executed!';
    // return 'Seed executed';
  }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import axios, { AxiosInstance } from 'axios';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}

  private readonly axios: AxiosInstance = axios;

  async executeSeed(){
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    data.results.forEach( async ({ name, url }) => {
      // console.log({ name, url });
      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];
      console.log({ name, no });
      try {
        const pokemon = await this.pokemonModel.create( { name, no } );
        return pokemon;
      } catch ( error: any ) {
        if( error.code === 11000 ){
          throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
        }
    
        // console.log(error);
        throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
      }
    });

    return 'Seed Executed!';
    // return 'Seed executed';
  }
}

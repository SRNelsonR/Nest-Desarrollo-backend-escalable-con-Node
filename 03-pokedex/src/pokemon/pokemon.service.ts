import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    // return 'This action adds a new pokemon';
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch ( error: any ) {
      // console.log(error);
      if( error.code === 11000 ){
        throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
      }

      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    // return `This action returns a #${id} pokemon`;

    let pokemon: Pokemon | null = null;

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) });
    }

    // MongoID
    if( !pokemon && isValidObjectId( term ) ){
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // return `This action updates a #${id} pokemon`;

    const pokemon = await this.findOne( term );

    if( updatePokemonDto && updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    // const updatedPokemon = await pokemon.updateOne( updatePokemonDto, { new: true } );

    await pokemon.updateOne( updatePokemonDto);

    return { ...pokemon.toJSON(), ...updatePokemonDto };

  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
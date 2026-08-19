import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit!: number;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configServide: ConfigService
  ){
    // console.log( process.env.DEFAULT_LIMIT );
    this.defaultLimit = configServide.get<number>('defaultLimit')!;
    // console.log( configServide.get('defaultLimit') );
    // console.log( defaultLimit );
  }

  async create(createPokemonDto: CreatePokemonDto) {
    // return 'This action adds a new pokemon';
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch ( error: any ) {
      // console.log(error);
      // if( error.code === 11000 ){
      //   throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
      // }

      // console.log(error);
      // throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
      this.handleException(error);
    }

  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1 // Eso significa que ordene la columna no de manera ascendente
      }).
      select('-__v'); //Elimina la columna __v
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

    try {
      await pokemon.updateOne( updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error: any) {
      // console.log(error);
      // throw new NotFoundException(`Pokemon with id, name or no "${ term }" already exist`);
      // if( error.code === 11000 ){
      //   throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
      // }

      // console.log(error);
      // throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
      this.handleException(error);
    }

  }

  async remove(id: string) {
    // return `This action removes a #${id} pokemon`;
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete( id );

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if( deletedCount === 0 )
        throw new BadRequestException(`Pokemon with id "${ id }" nod found`);

    return;
  }

  private handleException( error: any ){
    if( error.code === 11000 ){
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }

    // console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
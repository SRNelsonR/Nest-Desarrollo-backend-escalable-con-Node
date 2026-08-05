import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
// @UsePipes( ValidationPipe )
export class CarsController {

    // private cars = ['Toyota', 'Honda', 'Jeep']

    constructor(
        private readonly carsService: CarsService
    ) {}

    @Get()
    getAllCars(){
        return this.carsService.findAll();
    }

    // @Get('/:id/:status')
    @Get(':id')
    // Especificar version de uuid
    // getCarById( @Param('id', new ParseUUIDPipe( {version: '7'} ) ) id: string ){
    getCarById( @Param('id', ParseUUIDPipe) id: string ){
        console.log( { id } );
        // throw new Error('Auxilio');
        return this.carsService.findOneById( id );
    }

    @Post()
    // @UsePipes( ValidationPipe )
    createCar ( @Body() createCarDto: CreateCarDto ) {
        // return createCarDto;
        return this.carsService.create(createCarDto);
    }

    @Patch(':id')
    updateCar ( 
        @Param( 'id', ParseUUIDPipe ) id: string,
        @Body() updateCarDto: UpdateCarDto,
    ) {
        // return updateCarDto;
        console.log({ id, updateCarDto })
        return this.carsService.update( id, updateCarDto );
    }

    @Delete(':id')
    deleteCar ( @Param('id', ParseUUIDPipe ) id: string ) {
        console.log( {id} );
        return this.carsService.delete( id );
    }

}
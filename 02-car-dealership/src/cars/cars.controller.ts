import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
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
    createCar ( @Body() body: any ) {
        return body;
    }

    @Patch(':id')
    updateCar ( @Body() body: any ) {
        return body;
    }

    @Delete(':id')
    deleteCar ( @Param('id', ParseIntPipe) id: number ) {
        return {
            method: 'delete',
            id
        };
    }

}
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Car } from './interfaces/car.interface';
// import { CreateCarDto } from './dto/create-car.dto';
// import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
    
    private cars: Car[] = [
        // {
        //     id: uuid(),
        //     brand: 'Toyota',
        //     model: 'Corolla'
        // },
        // {
        //     id: uuid(),
        //     brand: 'Honda',
        //     model: 'Civic'
        // },
        // {
        //     id: uuid(),
        //     brand: 'Jeep',
        //     model: 'Cherokee'
        // },
    ];

    findAll(){
        return this.cars;
    }
    
    findOneById( id: string ) {
        const car = this.cars.find( car => car.id === id );

        // if ( !car ){
        //     throw new NotFoundException(`Car with id '${ id }' not found`);
        // }

        if ( !car ) throw new NotFoundException(`Car with id '${ id }' not found`);

        return car;
    }

    create( createCarDto: CreateCarDto ){
        // const car: Car = {
        //     id: uuid(),
        //     brand: createCarDto.brand,
        //     model: createCarDto.model,
        // }

        const car: Car = {
            id: uuid(),
            ...createCarDto
        }

        this.cars.push(car);
        
        return car;
    }

    update( id: string, updateCarDto: UpdateCarDto ){

        let carDB = this.findOneById( id );
        console.log(carDB);
        console.log(updateCarDto);

        if( updateCarDto.id && updateCarDto.id !== id )
            throw new BadRequestException( `Car id is not valid inside body` );

        // TODO: revisar este map porque cuando solo se envia brand en la petición, elimina el model, retornando el objeto solo con id y model.
        // this.cars = this.cars.map( car => {
        //     if( car.id === id ){
        //         carDB = {
        //             // Esparso las propiedades del carDB
        //             ...carDB,
        //             // Luego esparso las propiedades del update para sustituir las de carDB
        //             ...updateCarDto,
        //             // Si vienera algún ID, este lo sustituiría para dejar el que es
        //             id
        //         };
        //         console.log(carDB); 
        //         return carDB;
        //     }
        //     return car;
        // });

        this.cars = this.cars.map( car => {
            if( car.id === id ){
                carDB = {
                    id,
                    brand: updateCarDto.brand ?? car.brand,
                    model: updateCarDto.model ?? car.model,
                };
                console.log(carDB); 
                return carDB;
            }
            return car;
        });

        return carDB; //Carro actualizado
    }

    delete( id: string ){
        // console.log( id );
        // let carDB = this.findOneById( id );

        // this.cars = this.cars.filter( car => car.id !== id);
        // Otra solución
        const car = this.findOneById( id );
        this.cars = this.cars.filter( car => car.id !== id);
    }

}
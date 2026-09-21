import { 
    BeforeInsert, BeforeUpdate, Column, Entity, 
    ManyToOne, 
    OneToMany, PrimaryGeneratedColumn 
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from './';
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {
    
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty()
    @Column('text', {
        unique: true,
    })
    title!: string;

    @ApiProperty()
    @Column('float', {
        default: 0,
    })
    price!: number;

    @ApiProperty()
    // Otra forma de hacerlo
    @Column({
        type: 'text',
        nullable: true
    })
    description!: string;

    @ApiProperty()
    @Column('text', {
        unique: true
    })
    slug!: string;

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock!: number;

    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes!: string[];

    @ApiProperty()
    @Column('text')
    gender!: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: [],
    })
    tags!: string[];

    @ApiProperty()
    // images
    @OneToMany(
        // Coloca el retorno de un ProductImage, va a regresar un ProductImage
        () => ProductImage,
        // ¿Cómo se relaciona ProductImage con nuestra tabla?
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    // Saber que usuario creo el producto
    @ManyToOne(
        // Con que entidad se va a relacionar
        () => User,
        ( user ) => user.product,
        // Esto para traer automaticamente quien creo ese producto
        { eager: true }
    )
    user!: User

    @BeforeInsert()
    checkSlugInsert() {
        if( !this.slug ){
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

}
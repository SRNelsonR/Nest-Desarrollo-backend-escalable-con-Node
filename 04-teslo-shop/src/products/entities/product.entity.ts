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
    
    @ApiProperty({
        example: '0f111840-46e5-4e39-93cc-598d5ed2997f',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    title!: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float', {
        default: 0,
    })
    price!: number;

    @ApiProperty({
        example: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        description: 'Product Description',
        default: null,
    })
    // Otra forma de hacerlo
    @Column({
        type: 'text',
        nullable: true
    })
    description!: string;

    @ApiProperty({
        example: 'T_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true
    })
    slug!: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0,
    })
    @Column('int', {
        default: 0
    })
    stock!: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product Sizes',
    })
    @Column('text', {
        array: true
    })
    sizes!: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product Genders',
    })
    @Column('text')
    gender!: string;

    @ApiProperty({
        example: 'Shirt',
        description: 'Product Tags',
    })
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
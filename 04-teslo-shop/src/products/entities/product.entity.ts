import { 
    BeforeInsert, BeforeUpdate, Column, Entity, 
    ManyToOne, 
    OneToMany, PrimaryGeneratedColumn 
} from "typeorm";
import { ProductImage } from './';
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {
    
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text', {
        unique: true,
    })
    title!: string;

    @Column('float', {
        default: 0,
    })
    price!: number;

    // Otra forma de hacerlo
    @Column({
        type: 'text',
        nullable: true
    })
    description!: string;

    @Column('text', {
        unique: true
    })
    slug!: string;

    @Column('int', {
        default: 0
    })
    stock!: number;

    @Column('text', {
        array: true
    })
    sizes!: string[];

    @Column('text')
    gender!: string;

    @Column('text', {
        array: true,
        default: [],
    })
    tags!: string[];

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
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity()
export class ProductImage {
    
    // Al dejarlo como esta abajo seria lo mismo que @PrimaryGeneratedColumn('increment') ya es autoincrementable
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    url!: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' },
    )
    product!: Product
}
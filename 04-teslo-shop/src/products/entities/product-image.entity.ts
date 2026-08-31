import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
    
    // Al dejarlo como esta abajo seria lo mismo que @PrimaryGeneratedColumn('increment') ya es autoincrementable
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    url!: string;
}
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsArray()
    @ArrayNotEmpty()
    productIds: string[];
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';


@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }

    async findOne(id: string): Promise<Product> {
        return this.productModel.findById(id).exec();
    }

    async deleteByName(deleteProductDto: DeleteProductDto): Promise<{message: string}> {
        const result = await this.productModel.deleteOne({ name: deleteProductDto.name });
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Product with name "${deleteProductDto.name}" not found`);
        }
        return {message: `Product with name "${deleteProductDto.name}" Deleted`};
    }
}
